// @ts-check
/**
 * @typedef {import('sequelize').Model} Model
 * @typedef {import('./result').CurrentAttemptSmallResult} CurrentAttemptSmallResult
 * @typedef {import('./result').CurrentAttemptDetailResult} CurrentAttemptDetailResult
 * @typedef {import('./cast').CurrentAttemptDetailCast} CurrentAttemptDetailData
 * @typedef {import('./param').SingleAttemptParam} SingleAttemptParam
 */

const Attempt = require('../../../models/attempt');
const Question = require('../../../models/question');
const Test = require('../../../models/test');
const ATTEMPT_STATUS = require('../../../utils/const').ATTEMPT_STATUS;

class TestProcessQuery {

	/**
	 * Check if there is an In Progress attempt of a candidate for a test
	 * @param {SingleAttemptParam} param
	 * @returns {Promise<boolean>}
	 */
	async hasInProgressAttempt(param) {
		const { testId, candidateId } = param;
		const attempt = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
			attributes: ['ID']
		});
		return attempt != null;
	}

	/**
	 * Get the currently In Progress attempt of a candidate (small display)
	 * @param {SingleAttemptParam} param 
	 * @returns {Promise<CurrentAttemptSmallResult | null>} 
	 */
	async getInProgressAttemptSmall(param) {
		const { testId, candidateId } = param;
		const attempt = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
			attributes: ['ID', 'status', 'createdAt'],
			include: [{
				model: Test,
				attributes: ['minutesToAnswer'],
			}]
		});
		if (attempt == null) {
			return null;
		}
		const typed = attempt?.toJSON();
		if (typed.createdAt == null || typed["Test"] == null || typed["Test"].minutesToAnswer == null) {
			throw new Error('Invalid attempt data');
		}
		const endedAt = new Date(typed.createdAt.getTime() + typed["Test"].minutesToAnswer * 60 * 1000);
		return {
			ID: typed.ID.toString(),
			startedAt: new Date(typed.createdAt),
			endedAt: endedAt,
		}
	}

	/**
	 * Return the currently In Progress attempt of a candidate in detail for doing the test
	 * @param {SingleAttemptParam} param
	 * @returns {Promise<CurrentAttemptDetailResult>}
	 */
	async getInProgressAttemptToDo(param) {
		const { testId, candidateId } = param
		const attempt = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
			attributes: { exclude: ["score"] },
			include: [{
				model: Test,
				attributes: { exclude: ['answerCount'] },
				include: [{
					model: Question,
					attributes: { exclude: ['correctAnswer'] },
				}]
			}]
		});
		if (attempt == null) {
			throw new Error('Attempt not found');
		}
		/** @type {CurrentAttemptDetailData} */
		const typedData = attempt.toJSON();
		const endedAt = new Date(typedData.createdAt.getTime() + typedData.Test.minutesToAnswer * 60 * 1000);
		return {
			ID: typedData.ID,
			test: {
				...typedData.Test
			},
			questions: typedData.Test.Questions.map((question, index) => {
				const optionsWithId = question.options.map((option, index) => {
					return {
						ID: index,
						text: option,
					};
				});
				return {
					...question,
					options: optionsWithId
				};
			}),
			startedAt: typedData.createdAt,
			endedAt: endedAt,
		};
	}

	/**
	 * @param {string} attemptId 
	 * @returns {Promise<number[]>}
	 */
	async getChoicesOfAttempt(attemptId) {
		const attempt = await Attempt.findByPk(attemptId, {
			attributes: ['choices'],
		});
		if (attempt == null) {
			throw new Error('Attempt not found');
		}
		return attempt['choices'];
	}
}

module.exports = TestProcessQuery;