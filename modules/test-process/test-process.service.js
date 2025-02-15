// @ts-check
/**
 * @typedef {import('../../models/model').Test} Test
 * @typedef {import('../../models/model').Question} Question
 * @typedef {import('../../models/model').Attempt} Attempt
 * @typedef {import('./response').TestProcessResponse} TestProcess
 */

const cron = require('node-cron');
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

	constructor() {
		// Evaluate all test processes every minute
		cron.schedule('*/1 * * * *', () => {
			this.#evaluateAllTestProcess();
		});
	}

	/**
	 * Get the currently In Progress attempt of a candidate
	 * @param {string} testId 
	 * @param {string} candidateId 
	 * @returns {Promise<Attempt | null>}
	 */
	async #getPreviousInProgressAttempt(testId, candidateId) {
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
		/** @type {Attempt} */
		const attempt = attempts[0].toJSON();
		return attempt;
	}

	/**
 * Get the currently In Progress attempt of a candidate, throw if not found
 * @param {string} testId 
 * @param {string} candidateId 
 * @returns {Promise<Attempt>}
 */
	async #getPreviousInProgressAttemptStrict(testId, candidateId) {
		const attempt = await this.#getPreviousInProgressAttempt(testId, candidateId);
		if (attempt == null) {
			throw new Error('No attempt in progress');
		}
		return attempt;
	}

	/**
	 * @description Evaluate all test processes that are completed
	 */
	async #evaluateAllTestProcess() {
		const attempts = await Attempt.findAll({
			where: {
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
		});
		attempts.forEach(async (attempt) => {
			/** @type {Attempt} */
			const typedAttempt = attempt.toJSON();
			await evaluateTestAttempt(typedAttempt, String(typedAttempt.testId));
		});
	}

	/**
	 * Return the currently In Progress attempt of a candidate, if any
	 * @param {string} testId 
	 * @param {string} candidateId 
	 * @returns {Promise<TestProcess | null>}
	 */
	async getCurrentTestProcess(testId, candidateId) {
		const attempt = await this.#getPreviousInProgressAttempt(testId, candidateId);
		if (attempt == null) {
			return null;
		}
		/** @type {Test | undefined} */
		const test = (await Test.findByPk(testId))?.toJSON();
		if (test == null) {
			throw new Error('Test not found');
		}
		const questions = await Question.findAll({
			where: { testId: testId },
			order: [['ID', 'ASC']],
			attributes: ['ID', 'text', 'options', 'points'],
		});
		if (attempt.choices.length !== questions.length) {
			throw new Error('Invalid attempt data');
		}
		return {
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
					chosenOption: attempt.choices[index],
				}
			}),
		};
	}

	/**
	 * Evaluate previous test process of a candidate (if any) and start a new one
	 * @param {string} testId 
	 * @param {string} candidateId 
	 * @returns {Promise<void>}
	 */
	async startNewTestProcess(testId, candidateId) {
		// Find previous attempt and evaluate it if it exists
		const previousAttempt = await this.#getPreviousInProgressAttempt(testId, candidateId);
		if (previousAttempt != null) {
			await evaluateTestAttempt(previousAttempt, testId);
		}
		// Start a new attempt
		const questionsLength = await Question.count({
			where: { testId: testId },
		});

		const choices = [];
		for (let i = 0; i < questionsLength; i++) {
			choices.push(-1);
		}
		await Attempt.create({
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
	 * @description Answer a question
	 * @param {string} testId 
	 * @param {string} candidateId 
	 * @param {string} questionId 
	 * @param {string} chosenOption 
	 * @returns {Promise<void>}
	 */
	async answerQuestion(testId, candidateId, questionId, chosenOption) {
		const attempt = await this.#getPreviousInProgressAttemptStrict(testId, candidateId);
		attempt.choices[questionId] = chosenOption;
		await Attempt.update(
			{ choices: attempt.choices, updatedAt: new Date() },
			{ where: { ID: attempt.ID } }
		);
	}

	/**
	 * @description Evaluate the test process after the candidate has answered all questions or the time has expired (by cronjob)
	 * @param {string} testId
	 * @param {string} candidateId
	 * @returns {Promise<string>} - Attempt ID of the evaluated attempt
	 */
	async evaluateTestProcess(testId, candidateId) {
		const attempt = await this.#getPreviousInProgressAttemptStrict(testId, candidateId);
		await evaluateTestAttempt(attempt, testId);
		return String(attempt.ID);
	}
}

/**
 * @param {Attempt} typedAttempt
 * @param {string} testId
 */
async function evaluateTestAttempt(typedAttempt, testId) {
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

module.exports = new TestProcessService();