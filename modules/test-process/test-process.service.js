// @ts-check
/**
 * @typedef {import('../../models/model').Test} Test
 * @typedef {import('../../models/model').Question} Question
 * @typedef {import('../../models/model').Attempt} Attempt
 * @typedef {import('./response').CurrentAttemptDetailResponse} CurrentAttemptDetailResponse
 * @typedef {import('./response').CurrentAttemptResponse} CurrentAttemptResponse
 * @typedef {import('sequelize').Model} Model
 */

const schedule = require('node-schedule');
const Attempt = require('../../models/attempt');
const Question = require('../../models/question');
const Test = require('../../models/test');
const ATTEMPT_STATUS = require('../../utils/const').ATTEMPT_STATUS;

const SYNC_TIME = 5000; // 5 seconds

/**
 * @class TestProcessService
 * @description Service class to group methods that handle the process of taking a test by a candidate (e.g. start, answer, evaluate)
 * 
 */
class TestProcessService {
	constructor() {
		this.#loadInprogresses();
		this.onTestProcessEvaluated = (attemptId) => { };
		this.onTestProcessSync = (attemptId, timeLeft) => { };
	}

	/**
	 * Load all test processes that are in progress and schedule their evaluation
	 */
	async #loadInprogresses() {
		const attempts = await Attempt.findAll({
			where: {
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
			include: [
				{
					model: Test,
					attributes: ['minutesToAnswer'],
				}
			]
		});
		attempts.forEach(async (attempt) => {
			const typedAttempt = attempt.toJSON();
			if (typedAttempt.ID === undefined) {
				throw new Error('Invalid attempt data');
			}
			const attemptId = typedAttempt.ID.toString();

			// Set sync interval
			const interval = setInterval(async () => {
				const timeLeft = await this.getTimeLeft(attemptId);
				this.onTestProcessSync.apply(attemptId, timeLeft);
				if (timeLeft <= 0) {
					clearInterval(interval);
				}
			}, SYNC_TIME);

			// Schedule evaluation
			if (typedAttempt.createdAt == null) {
				throw new Error('Invalid attempt data');
			}
			const endDate = new Date(typedAttempt.createdAt.getTime() + typedAttempt["Test"].minutesToAnswer * 60 * 1000);
			if (endDate < new Date()) {
				await evaluateTestAttempt(typedAttempt);
				return;
			}
			const jobName = `evaluate-test-${typedAttempt.ID}`;
			schedule.scheduleJob(jobName, endDate, async () => {
				try {
					await evaluateTestAttempt(typedAttempt);
					console.log(`Scheduled job for: ${jobName}`);
				} catch (error) {
					console.error(`Failed schedule for: ${jobName}`, error);
				}
			});
		});
	}

	/**
	 * Get the currently In Progress attempt of a candidate
	 * @param {string} testId 
	 * @param {string} candidateId 
	 */
	async #getInProgressAttempt(testId, candidateId) {
		const attempts = await Attempt.findAll({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
		});
		if (attempts.length > 1) {
			throw new Error('Invalid data state, multiple attempts in progress');
		}
		if (attempts.length === 0) {
			return null;
		}
		return attempts[0];
	}

	/**
	 * Get the currently In Progress attempt of a candidate (small display)
	 * @param {string} testId 
	 * @param {string} candidateId 
	 * @returns {Promise<CurrentAttemptResponse | null>} 
	 */
	async getOngoingTest(testId, candidateId) {
		const attempt = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
			include: [{
				model: Test,
				attributes: ['minutesToAnswer'],
			}]
		});
		if (attempt == null) {
			return null;
		}
		const typed = attempt?.toJSON();
		if (typed.createdAt == null) {
			throw new Error('Invalid attempt data');
		}
		return {
			ID: typed.ID?.toString() || '',
			status: typed.status,
			score: null,
			createdAt: typed.createdAt.toString(),
			endDate: new Date(typed.createdAt.getTime() + typed["Test"].minutesToAnswer * 60 * 1000).toString(),
		}
	}

	/**
	 * Return the currently In Progress attempt of a candidate in detail for doing the test
	 * @param {string} testId
	 * @param {string} candidateId
	 * @returns {Promise<CurrentAttemptDetailResponse>}
	 */
	async getOngoingTestToDo(testId, candidateId) {
		const attempt = await this.#getInProgressAttempt(testId, candidateId);
		if (attempt == null) {
			throw new Error('No attempt in progress');
		}
		return await generateTestResponse(attempt.toJSON());
	}

	/**
	 * Quit the previous test process of a candidate (if any) and re-create a new currently In Progress attempt
	 * @param {string} testId 
	 * @param {string} candidateId 
	 * @returns {Promise<void>}
	 */
	async startNew(testId, candidateId) {
		// Find previous attempt and evaluate it if it exists
		const previousAttempt = await this.#getInProgressAttempt(testId, candidateId);
		if (previousAttempt != null) {
			await evaluateTestAttempt(previousAttempt.toJSON());
		}
		// Start a new attempt
		const questionsLength = await Question.count({
			where: { testId: testId },
		});

		const choices = [];
		for (let i = 0; i < questionsLength; i++) {
			choices.push(-1);
		}
		const attempt = await Attempt.create({
			testId: +testId,
			candidateId: candidateId,
			choices: choices,
			score: 0,
			status: ATTEMPT_STATUS.IN_PROGRESS,
			createdAt: new Date(),
			updatedAt: new Date()
		});
		await Test.increment('answerCount', { where: { ID: testId } });
	}

	/**
	 * Get time left for a candidate to finish the test (in milliseconds)
	 * @param {string} attemptId 
	 * @returns {Promise<number>} Time left in milliseconds
	 */
	async getTimeLeft(attemptId) {
		const attempt = (await Attempt.findByPk(attemptId))?.toJSON();
		if (attempt == null || attempt.createdAt == null) {
			throw new Error('Attempt not found');
		}
		const test = (await Test.findByPk(attempt.testId))?.toJSON();
		if (test == null) {
			throw new Error('Test not found');
		}
		const timeLeft = attempt.createdAt.getTime() + test.minutesToAnswer * 60 * 1000 - new Date().getTime();
		return timeLeft;
	}

	/**
	 * 
	 * @param {string} testId 
	 * @param {string} candidateId
	 * @param {{questionId: string, optionId: string}[]} answers 
	 * @returns 
	 */
	async submit(testId, candidateId, answers) {
		const attempt = await this.#getInProgressAttempt(testId, candidateId);
		if (attempt == null) {
			throw new Error('Attempt to submit is not found');
		}
		const choices = [...attempt.get().choices];
		for (const answer of answers) {
			if (answer.questionId === undefined || answer.optionId === undefined) {
				throw new Error('Invalid answer data');
			}
			choices[+answer.questionId] = +answer.optionId;
		}
		attempt.set('choices', choices);
		await attempt.save();
		await evaluateTestAttempt(attempt.toJSON());
	}
}

const service = new TestProcessService();

/**
 * Generate a test response for a candidate to do
 * @param {Attempt} attempt 
 * @returns {Promise<CurrentAttemptDetailResponse>}
 */
async function generateTestResponse(attempt) {
	const test = (await Test.findByPk(attempt.testId))?.toJSON();
	if (test == null) {
		throw new Error('Test not found');
	}
	const questions = await Question.findAll({
		where: { testId: test.ID },
		order: [['ID', 'ASC']],
		attributes: ['ID', 'text', 'options', 'points'],
	});
	if (attempt.ID === undefined ||
		attempt.choices.length !== questions.length ||
		attempt.createdAt == null) {
		throw new Error('Invalid attempt data');
	}
	return {
		ID: attempt.ID.toString(),
		test: {
			...test
		},
		questions: questions.map((q, index) => {
			/** @type {Question} */
			const typedQuestion = q.toJSON();
			if (typedQuestion.ID === undefined) {
				throw new Error('Invalid question data');
			}
			const optionsWithId = typedQuestion.options.map((option, index) => {
				return {
					ID: index,
					text: option,
				};
			});
			return {
				...typedQuestion,
				ID: typedQuestion.ID,
				options: optionsWithId.map((option, index) => ({
					ID: index,
					text: option.text,
				})),
			};
		}),
		startedAt: attempt.createdAt,
		endedAt: new Date(attempt.createdAt.getTime() + test.minutesToAnswer * 60 * 1000),
	};
}

/**
 * @param {Attempt} typedAttempt
 */
async function evaluateTestAttempt(typedAttempt) {
	const testId = typedAttempt.testId;
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
	service.onTestProcessEvaluated.apply(typedAttempt.ID);
}

module.exports = service;