// @ts-check

/**
 * @typedef {import('./model').AttemptModel} AttemptModel
 * @typedef {import('./model').QuestionModel} QuestionModel
 * @typedef {import('sequelize').Model} Model
 */

const Attempt = require("../../../models/attempt");
const Question = require('../../../models/question');
const Test = require('../../../models/test');
const { ATTEMPT_STATUS } = require("../../../utils/const");

/**
 * @param {Model} attempt 
 * @returns {AttemptModel}
 */
function typeCastAttempt(attempt) {
	/** @type {AttemptModel} */
	const typed = attempt.toJSON();
	return typed;
}

/**
 * @param {Model} question
 * @returns {QuestionModel}
 */
function typeCastQuestion(question) {
	/** @type {QuestionModel} */
	const typed = question.toJSON();
	return typed;
}

class RetriverAttempt {
	async getAllInProgress() {
		const result = await Attempt.findAll({
			where: {
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
			include: {
				model: Test
			}
		});
		const typeds = result.map((r) => typeCastAttempt(r));
		return typeds;
	}

	/**
	 * @param {string} testId 
	 * @param {string} candidateId 
	 * @returns {Promise<AttemptModel | null>}
	 */
	async getInprogressOfCandidate(testId, candidateId) {
		const results = await Attempt.findAll({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
			include: "Test",
		});
		if (results.length > 1) {
			throw new Error('Invalid data state, multiple attempts in progress');
		}
		if (results.length === 0) {
			return null;
		}
		const typed = typeCastAttempt(results[0]);
		return typed;
	}

	/**
	 * @param {string} testId 
	 */
	async getQuestionsOfTestASC(testId) {
		const result = await Question.findAll({
			where: {
				testId: testId,
			},
			order: [["ID", "ASC"]]
		});
		const typeds = result.map((r) => typeCastQuestion(r));
		return typeds;
	}
}

module.exports = RetriverAttempt;