// @ts-check
/**
 * @typedef {import('../../types/model').Test} Test
 * @typedef {import('../../types/model').Question} Question
 * @typedef {import('../../types/model').Attempt} Attempt
 * @typedef {import('./type').TestProcess} TestProcess
 */

const Attempt = require('../../models/attempt');
const Question = require('../../models/question');
const Test = require('../../models/test');
const ATTEMPT_STATUS = require('../../utils/const').ATTEMPT_STATUS;

/**
 * @class TestProcessService
 * @description Service class to group methods that handle the process of taking a test by a candidate (e.g. start, answer, evaluate)
 * 
 */
class TestProcessService {
	/** 
	 * @description Get the previous test process of a candidate or create a new one if not exists or expired
	 * @param {string} testId
	 * @param {string} candidateId
	 * @returns {Promise<TestProcess>}
	 */
	async getTestProcess(testId, candidateId) {
		/**
		 * @type {Test | undefined}
		 */
		const test = (await Test.findByPk(testId))?.toJSON();
		if (test == null) {
			throw new Error('Test not found');
		}
		const questions = await Question.findAll({
			where: { testId: testId },
			order: [['ID', 'ASC']],
			attributes: ['ID', 'text', 'options', 'points'],
		});
		// Check if the test is already started by the candidate and not expired
		/** @type {Attempt | undefined} */
		const attempt = (await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
		}))?.toJSON();
		const choices = [];
		if (attempt === undefined) {
			questions.forEach(_ => {
				choices.push(-1);
			});
			/** @type {Attempt} */
			await Attempt.create({
				testId: testId,
				candidateId: candidateId,
				choices: choices,
				score: 0,
				status: ATTEMPT_STATUS.IN_PROGRESS,
				createdAt: new Date(),
				updatedAt: new Date()
			});
			await Test.increment('answerCount', { where: { ID: testId } });
			return {
				test: {
					...test
				},
				questions: questions.map(q => {
					/** @type {Question} */
					const typed = q.toJSON();
					const optionsWithId = typed.options.map((option, index) => {
						return {
							ID: index,
							text: option,
						};
					});
					return {
						...typed,
						ID: typed.ID === undefined ? -1 : typed.ID,
						options: optionsWithId.map((option, index) => ({
							ID: index,
							text: option.text,
						})),
						chosenOption: -1,
					}
				}),
			};
		}
		else {
			if (attempt.choices.length !== questions.length) {
				throw new Error('Invalid attempt data');
			}
			return {
				test: {
					...test
				},
				questions: questions.map((q, index) => {
					/** @type {Question} */
					const typed = q.toJSON();
					const optionsWithId = typed.options.map((option, index) => {
						return {
							ID: index,
							text: option,
						};
					});
					return {
						...typed,
						ID: typed.ID === undefined ? -1 : typed.ID,
						options: optionsWithId.map((option, index) => ({
							ID: index,
							text: option.text,
						})),
						chosenOption: attempt.choices[index],
					}
				}),
			};
		}
	}

	/**
	 * @description Answer a question
	 * @param {string} testId 
	 * @param {string} candidateId 
	 * @param {string} questionId 
	 * @param {string} chosenOption 
	 * @returns {Promise<void>}
	 */
	async answerQuestion(testId, candidateId, questionId, chosenOption) {
		const attempt = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
		});
		if (!attempt) {
			throw new Error(`Candidate has not started the test`);
		}
		/** @type {Attempt} */
		const typed = attempt.toJSON();
		typed.choices[questionId] = chosenOption;

		await Attempt.update(
			{ choices: typed.choices, updatedAt: new Date() },
			{ where: { ID: typed.ID } }
		);
	}

	/**
	 * @description Evaluate the test process after the candidate has answered all questions or the time has expired (by cronjob)
	 * @param {string} testId
	 * @param {string} candidateId
	 * @returns {Promise<void>}
	 */
	async evaluateTestProcess(testId, candidateId) {
		const attempt = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
		});
		if (!attempt) {
			throw new Error(`Candidate has not started the test`);
		}
		/** @type {Attempt} */
		const typedAttempt = attempt.toJSON();
		const questions = await Question.findAll({
			where: { testId: testId },
			order: [['ID', 'ASC']],
			attributes: ['ID', 'correctAnswer', 'points'],
		});
		let totalScore = 0;
		questions.forEach((question, index) => {
			/** @type {Question} */
			const typedQuestion = question.toJSON();
			if (typedQuestion.correctAnswer === typedAttempt.choices[index]) {
				totalScore += typedQuestion.points;
			}
		});
		await Attempt.update(
			{ score: totalScore, status: ATTEMPT_STATUS.COMPLETED, updatedAt: new Date() },
			{ where: { ID: typedAttempt.ID } }
		);
	}
}

module.exports = new TestProcessService();