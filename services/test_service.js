const BaseService = require('./base_service');
const Test = require('../models/test');
const Attempt = require('../models/attempt');
const Tag = require('../models/tag');
const Test_Tag = require('../models/test_tag');
const Question = require('../models/question');
const { Op, Sequelize } = require('sequelize');

class TestService extends BaseService {
	constructor() {
		super(Test);
	}

	/// Helpers

	shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	async getTotalScore(testId) {
		const totalScore = await Question.sum('points', {
			where: { testId }
		});
		return totalScore;
	}

	async getTotalQuestions(testId) {
		return await Question.count({
			where: { testId }
		});
	}

	async getQuestionsWithCandidateChoice(testId, attemptId) {
		const attempt = await Attempt.findByPk(attemptId, {
			attributes: ["choices"],
		});
		if (!attempt) {
			throw new Error("Attempt not found");
		}
		const questions = await Question.findAll({
			where: { testId },
		});

		const questionsWithCandidateChoice = questions.map((question, index) => ({
			ID: `${question.ID}`,
			question: question.text,
			options: question.options,
			correctAnswer: question.correctAnswer,
			chosenAnswer: attempt.choices[index] !== undefined ? attempt.choices[index] : null,
			score: question.points
		}));

		return questionsWithCandidateChoice;
	}

	async getQuestionsDetails(testId, attemptId) {
		// todo: Remove testId from the query. It is not needed
		const attempt = await Attempt.findOne({
			where: {
				ID: attemptId,
				testId: testId
			},
			attributes: ["ID", "score", "status", "choices"],
		});
		if (!attempt) {
			throw new Error("Attempt not found or does not belong to the specified test");
		}

		const questions = await Question.findAll({
			where: { testId },
		});

		const questionsWithDetails = questions.map((question, index) => ({
			ID: `${question.ID}`,
			text: question.text,
			points: question.points,
			choices: question.options.map((option, optionIndex) => ({
				ID: `${optionIndex}`,
				text: option,
				isChoosen: attempt.choices[index] === optionIndex,
				isCorrect: optionIndex === question.correctAnswer,
			})),
		}));

		return questionsWithDetails;
	}

	async getCandidateAttempts(candidateId) {
		const attempts = await Attempt.findAll({
			where: { candidateId },
			attributes: ["ID", "testId", "score", "status", "createdAt"]
		});

		const testsMap = {};
		for (let attempt of attempts) {
			const testId = attempt.testId;
			if (!testsMap[testId]) {
				const test = await Test.findByPk(testId, {
					attributes: ["ID", "title", "description"]
				});
				if (test) {
					testsMap[testId] = {
						testId: `${test.ID}`,
						title: test.title,
						description: test.description,
						attempts: []
					};
				}
			}
			const questionsWithCandidateChoice = await this.getQuestionsWithCandidateChoice(testId, attempt.ID);
			if (testsMap[testId]) {
				testsMap[testId].attempts.push({
					ID: `${attempt.ID}`,
					score: attempt.score,
					status: attempt.status,
					answer: questionsWithCandidateChoice,
					createdAt: attempt.createdAt
				});
			}
		}

		const tests = Object.values(testsMap);
		return tests;
	}

	/// Business Manager API

	async createTest(testDetails) {
		const tags = testDetails.tags;
		if (tags && tags.length > 0) {
			const tagInstances = await Promise.all(
				tags.map(tag => Tag.findOrCreate({ where: { name: tag } }))
			);

			const tagIds = tagInstances.map(([tagInstance]) => tagInstance.ID);

			await Promise.all(
				tagIds.map(tagId => Test_Tag.create({ testId: test.ID, tagId }))
			);
		}
		const test = await Test.create({
			companyId: testDetails.companyId,
			title: testDetails.title,
			description: testDetails.description,
			minutesToAnswer: testDetails.minutesToAnswer,
			difficulty: testDetails.difficulty || 'Easy',
			tags: testDetails.tags,
			answerCount: 0,
		});
		return test;
	}

	async updateTest(id, data) {
		// Check if any attempts exist for the test
		const attemptsExist = await Attempt.count({
			where: { testId: id }
		});

		if (attemptsExist > 0) {
			const error = new Error("Cannot update test because attempts exist for this test");
			error.statusCode = 400;
			throw error;
		}

		return await this.update(id, data);
	}

	async deleteTest(id) {
		await Question.destroy({
			where: { testId: id }
		});

		await this.delete(id);
		return { message: "Test and associated questions deleted successfully" };
	}

	async addMultipleQuestions(testId, questionsData) {
		const questions = await Promise.all(
			questionsData.map(questionData => {
				return Question.create({
					testId: testId,
					text: questionData.text,
					options: questionData.options,
					points: questionData.points,
					correctAnswer: questionData.correctAnswer
				});
			})
		);
		return questions;
	}

	async updateMultipleQuestions(testId, questionsData) {
		const updatedQuestions = await Promise.all(
			questionsData.map(async questionData => {
				const question = await Question.findOne({
					where: {
						ID: questionData.ID,
						testId: testId
					}
				});

				if (!question) {
					throw new Error(`Question with ID ${questionData.ID} not found`);
				}

				return await question.update(questionData);
			})
		);
		return updatedQuestions;
	}

	async deleteQuestion(testId, questionId) {
		const question = await Question.findOne({
			where: {
				ID: questionId,
				testId: testId
			}
		});

		if (!question) {
			throw new Error("Question not found");
		}

		await question.destroy();
		return { message: "Question deleted successfully" };
	}

	async getAttemptsByTestId(testId) {
		const attempts = await Attempt.findAll({
			where: { testId },
			attributes: ["ID", "score", "candidateId", "createdAt", "status", "choices"],
		});

		const attemptList = attempts.map(attempt => {
			const totalQuestions = attempt.choices.length;
			const perCent = attempt.choices.filter(c => c !== -1).length / totalQuestions * 100;
			return {
				attemptId: `${attempt.ID}`,
				candidateId: attempt.candidateId,
				createAt: attempt.createdAt,
				completeness: perCent,
				score: attempt.score,
			};
		});
		return attemptList;
	}

	async findByTestId(testId) {
		const test = await this.model.findByPk(testId);
		const totalScore = await this.getTotalScore(testId);
		return {
			testName: test.title,
			minutesToAnswer: test.minutesToAnswer,
			difficulty: test.difficulty,
			totalPoints: totalScore
		};
	}

	async getCandidateAttemptDetails(candidateId, attemptId) {
		const attempt = await Attempt.findOne({
			where: {
				ID: attemptId,
				candidateId: candidateId
			},
			attributes: ["ID", "candidateId", "testId", "score", "status", "createdAt"],
		});

		if (!attempt) {
			throw new Error("Attempt not found or does not belong to the specified candidate");
		}

		const questionsWithCandidateChoice = await this.getQuestionsWithCandidateChoice(attempt.testId, attempt.ID);

		return {
			ID: `${attempt.ID}`,
			testId: attempt.testId,
			score: attempt.score,
			status: attempt.status,
			answer: questionsWithCandidateChoice,
			createdAt: attempt.createdAt
		};
	}

	/// Both roles API

	async getQuestions(testId) {
		const test = await Test.findByPk(testId);
		if (!test) {
			throw new Error("Test not found");
		}

		const questions = await Question.findAll({
			where: { testId },
			attributes: ["ID", "text", "options", "points", "correctAnswer"],
		});

		const questionsWithDetails = questions.map((question) => {
			const optionsWithIds = question.options.map((option, optionIndex) => ({
				ID: `${optionIndex}`,
				text: option,
			}));
			const shuffledOptions = this.shuffleArray(optionsWithIds);
			return {
				ID: `${question.ID}`,
				text: question.text,
				points: question.points,
				choices: shuffledOptions,
				correctAnswer: question.correctAnswer,
			};
		});

		return {
			title: test.title,
			questions: questionsWithDetails,
		};
	};

	/// Candidate API

	async getTagNames(testId) {
		const Tags = await Test_Tag.findAll({
			where: { testId },
			attributes: ['tagId']
		});

		const tagIds = Tags.map(Tag => Tag.tagId);

		const tags = await Tag.findAll({
			where: { ID: { [Op.in]: tagIds } },
			attributes: ['name']
		});

		return tags.map(tag => tag.name);
	}

	async getSuggestedTags() {
		const tags = await Tag.findAll({
			attributes: ['name'],
			order: Sequelize.literal('RAND()'), // Random order
			limit: 5,
		});

		return { suggestedTags: tags.map((tag) => tag.name) };
	};

	async getFilteredTests({ minMinute, maxMinute, difficulty, tags, searchName }, page = 1, perPage = 20) {
		const query = {
			where: {
				minutesToAnswer: {
					[Op.gte]: minMinute || 0,
					[Op.lte]: maxMinute || Number.MAX_VALUE,
				},
				difficulty: difficulty ? { [Op.eq]: difficulty } : { [Op.ne]: null },
				title: searchName ? { [Op.like]: `%${searchName}%` } : { [Op.ne]: null },
			},
			include: [],
		};

		const tests = await Test.findAll(query);
		let filteredTests = [];
		if (tags && tags instanceof Array && tags.length > 0) {
			for (const test of tests) {
				const tagNames = await this.getTagNames(test.ID);
				if (tags.some(tag => tagNames.includes(tag))) {
					filteredTests.push(test);
				}
			}
		}
		else {
			filteredTests = tests;
		}

		// Pagination logic
		const totalTests = filteredTests.length;
		const totalPages = Math.ceil(totalTests / perPage);
		const paginatedTests = filteredTests.slice((page - 1) * perPage, page * perPage);

		for (const test of paginatedTests) {
			const tagNames = await this.getTagNames(test.ID);
			test.dataValues.tags = tagNames;
			test.dataValues.ID = `${test.dataValues.ID}`;
		}

		return { page: page, perPage: perPage, totalPage: totalPages, data: paginatedTests };
	};

	async getTestDetails(testId) {
		const test = await Test.findByPk(testId);
		if (!test) throw new Error("Test not found");

		const tagNames = await this.getTagNames(testId);
		const highestScore = await Attempt.max("score", {
			where: { testId: testId },
		});

		return {
			ID: `${test.ID}`,
			companyId: test.companyId,
			title: test.title,
			description: test.description,
			minutesToAnswer: test.minutesToAnswer,
			tags: tagNames, // Extract tag names
			answerCount: test.answerCount,
			highestScore: highestScore || 0, // Default to 0 if no attempts
			createdAt: test.createdAt,
		};
	}

	async getTestAttempts(testId, page = 1, perPage = 20) {
		const attempts = await Attempt.findAll({
			where: { testId },
			attributes: ["ID", "score", "status", "createdAt"],
		});

		// Pagination logic
		const totalAttempts = attempts.length;
		const totalPages = Math.ceil(totalAttempts / perPage);
		const paginatedAttempts = attempts.slice((page - 1) * perPage, page * perPage);

		for (const attempt of paginatedAttempts) {
			attempt.dataValues.ID = `${attempt.dataValues.ID}`;
		}

		return { page: page, perPage: perPage, totalPage: totalPages, data: paginatedAttempts };
	};

	async getAttemptPage(testId, attemptId) {
		const attempt = await Attempt.findOne({
			where: {
				ID: attemptId,
				testId: testId
			},
			attributes: ["ID", "score", "status", "choices"],
		});
		if (!attempt) {
			throw new Error("Attempt not found or does not belong to the specified test");
		}

		const test = await Test.findByPk(testId, {
			attributes: ["ID", "companyId", "title"]
		});
		if (!test) {
			throw new Error("Test not found");
		}

		const tagNames = await this.getTagNames(testId);
		const totalScore = await this.getTotalScore(testId);
		const totalQuestions = await this.getTotalQuestions(testId);

		return {
			id: `${attempt.ID}`,
			companyId: test.companyId,
			title: test.title,
			tags: tagNames,
			score: attempt.score,
			totalScore: totalScore,
			totalQuestions: totalQuestions,
		};
	}

	async getAttemptDetails(testId, attemptId, page = 1, perPage = 20) {
		const questions = await this.getQuestionsDetails(testId, attemptId);
		// Pagination logic
		const totalQuestions = questions.length;
		const totalPages = Math.ceil(totalQuestions / perPage);
		const paginatedQuestions = questions.slice((page - 1) * perPage, page * perPage);

		return { page: page, perPage: perPage, totalPage: totalPages, data: paginatedQuestions };
	}

	async submit(userId, attemptData) {
		const { testId, answers } = attemptData;

		const questions = await Question.findAll({
			where: { testId },
		});

		let score = 0;
		let status = 'Incomplete';
		const choices = new Array(questions.length).fill(-1);

		answers.forEach(answer => {
			const question = questions.find((q, index) => index == answer.questionId);
			if (question) {
				const choiceIndex = parseInt(answer.choiceId);
				if (choiceIndex !== -1) {
					choices[questions.indexOf(question)] = choiceIndex;
					if (choiceIndex === question.correctAnswer) {
						score += question.points;
					}
				}
			}
		});

		if (!choices.includes(-1)) {
			status = 'Finished';
		}

		const attempt = await Attempt.create({
			testId: testId,
			candidateId: userId,
			choices: choices,
			score: score,
			status: status,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		await Test.increment('answerCount', { where: { ID: testId } });

		return attempt;
	}
}

testService = new TestService();
module.exports = testService;
