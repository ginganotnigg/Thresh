// @ts-check
/**
 * @typedef {import('./model').AttemptModel} AttemptModel
 * @typedef {import('./param').AnswerAttemptParam} AnswerAttemptParam
 * @typedef {import('./param').SubmitAttemptParam} SubmitAttemptParam
 * @typedef {import('./param').StartNewAttemptParam} StartNewAttemptParam
 * @typedef {import('sequelize').Model} Model
 * 
 * @callback onTestProcessEvaluated
 * @param {string} attemptId
 * @returns {void}
 * 
 * @callback onTestProcessSync
 * @param {string} attemptId
 * @param {number} timeLeft
 * @returns {void}
 * 
 * @callback onTestProcessAnswered
 * @param {string} attemptId
 * @param {number[]} choices
 * @returns {void}
 */

const schedule = require('node-schedule');
const Attempt = require('../../../models/attempt');
const Question = require('../../../models/question');
const Test = require('../../../models/test');
const QueryAttempt = require('./retriver.repo');
const CommandAttempt = require('./write.repo');
const ATTEMPT_STATUS = require('../../../utils/const').ATTEMPT_STATUS;

const SYNC_TIME = 5000; // 5 seconds

class TestProcessCommand {
	constructor() {
		this.retriver = new QueryAttempt();
		this.command = new CommandAttempt();
		/** @type {onTestProcessEvaluated} */
		this.onTestProcessEvaluated = (attemptId) => { };
		/** @type {onTestProcessSync} */
		this.onTestProcessSyncTime = (attemptId, timeLeft) => { };
		/** @type {onTestProcessAnswered} */
		this.onTestProcessAnswered = (attemptId, choices) => { };
		this.#loadInprogresses();
	}

	/**
	 * Load all test processes that are in progress and schedule their evaluation
	 */
	async #loadInprogresses() {
		const attempts = await this.retriver.getAllInProgress();
		attempts.forEach(async (attempt) => {
			await this.#setAttemptLive(attempt);
		});
	}

	/**
	 * Evaluate a test attempt and notify the result
	 * @param {AttemptModel} attempt
	 * @returns {Promise<void>}
	 * @fires onTestProcessEvaluated
	 */
	async #evaluateTestAttempt(attempt) {
		const questions = await this.retriver.getQuestionsOfTestASC(attempt.testId);
		let totalScore = 0;
		questions.forEach((question, index) => {
			if (question.correctAnswer === attempt.choices[index]) {
				totalScore += question.points;
			}
		});
		await this.command.updateScore(attempt.ID, totalScore);
		this.onTestProcessEvaluated(attempt.ID);
	}

	/**
	 * Load the attempt to the memory and schedule the evaluation (make it live)
	 * @param {AttemptModel} attempt 
	 * @returns 
	 */
	async #setAttemptLive(attempt) {
		const endDate = new Date(attempt.createdAt.getTime() + attempt.Test.minutesToAnswer * 60 * 1000);
		const timeLeft = endDate.getTime() - new Date().getTime();

		// Set sync interval
		const interval = setInterval(async () => {
			if (timeLeft <= 0) {
				clearInterval(interval);
			}
			this.onTestProcessSyncTime.call(attempt.ID, timeLeft);
		}, SYNC_TIME);

		// Schedule evaluation
		if (endDate < new Date()) {
			await this.#evaluateTestAttempt(attempt);
			return;
		}
		const jobName = `evaluate-test-${attempt.ID}`;
		schedule.scheduleJob(jobName, endDate, async () => {
			try {
				await this.#evaluateTestAttempt(attempt);
				console.log(`Scheduled job for: ${jobName}`);
			} catch (error) {
				console.error(`Failed schedule for: ${jobName}`, error);
			}
		});
	}

	/**
	 * Quit the previous test process of a candidate (if any) and re-create a new currently In Progress attempt
	 * @param {StartNewAttemptParam} param 
	 * @returns {Promise<void>}
	 */
	async startNew(param) {
		const { testId, candidateId } = param;
		// Find previous attempt and evaluate it if it exists
		const previousAttempt = await this.retriver.getInprogressOfCandidate(testId, candidateId);
		if (previousAttempt != null) {
			await this.#evaluateTestAttempt(previousAttempt);
		}
		await this.command.createAttemptForCandidate(testId, candidateId);
		const attempt = await this.retriver.getInprogressOfCandidate(testId, candidateId);
		if (attempt == null) {
			throw new Error('Attempt is not yet started');
		}
		this.#setAttemptLive(attempt);
	}

	/**
	 * @param {AnswerAttemptParam} param
	 */
	async answer(param) {
		const { testId, candidateId, questionId, optionId } = param;
		const attempt = await this.retriver.getInprogressOfCandidate(testId, candidateId);
		if (attempt == null) {
			throw new Error('Attempt to answer is not found');
		}
		const choices = [...attempt.choices];
		choices[+questionId] = +optionId;
		await this.command.updateChoices(attempt.ID, choices);
		this.onTestProcessAnswered(attempt.ID, choices);
	}

	/**
	 * @param {SubmitAttemptParam} param
	 */
	async submit(param) {
		const { testId, candidateId } = param;
		const attempt = await this.retriver.getInprogressOfCandidate(testId, candidateId);
		if (attempt == null) {
			throw new Error('Attempt to submit is not found');
		}
		await this.#evaluateTestAttempt(attempt);
	}
}

module.exports = TestProcessCommand;