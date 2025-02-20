// @ts-check

/**
 * @typedef {import('./model').AttemptModel} AttemptModel
 * @typedef {import('./cast').SmallAttemptCast} SmallAttemptCast
 * @typedef {import('./model').QuestionModel} QuestionModel
 * @typedef {import('./cast').AttemptChoiceCast} AttemptChoiceCast
 * @typedef {import('sequelize').Model} Model
 */

const Attempt = require("../../../models/attempt");
const AttemptQuestions = require('../../../models/attempt_questions');
const Question = require('../../../models/question');
const Test = require('../../../models/test');
const { ATTEMPT_STATUS } = require("../../../utils/const");

/**
 * @param {Model} attempt 
 * @returns {AttemptModel}
 */
function toAttemptModel(attempt) {
	/** @type {AttemptModel} */
	const typed = attempt.toJSON();
	return typed;
}

function typeCastAttemptSmall(attempt) {
	/** @type {SmallAttemptCast} */
	const typed = attempt.toJSON();
	return typed;
}

/**
 * @param {Model} question
 * @returns {QuestionModel}
 */
function toQuestionModel(question) {
	/** @type {QuestionModel} */
	const typed = question.toJSON();
	return typed;
}

class RetriverAttempt {
	async retriveAllInProgress() {
		const result = await Attempt.findAll({
			where: {
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
			include: [
				{
					model: Test
				},
				{
					model: AttemptQuestions
				}
			]
		});
		const typeds = result.map((r) => toAttemptModel(r));
		return typeds;
	}

	/**
	 * @param {string} testId 
	 * @param {string} candidateId 
	 * @returns {Promise<AttemptModel | null>}
	 */
	async retriveInprogressOfCandidate(testId, candidateId) {
		const results = await Attempt.findAll({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: ATTEMPT_STATUS.IN_PROGRESS,
			},
			include: [
				{
					model: Test
				},
				{
					model: AttemptQuestions
				}
			]
		});
		if (results.length > 1) {
			throw new Error('Invalid data state, multiple attempts in progress');
		}
		if (results.length === 0) {
			return null;
		}
		const typed = toAttemptModel(results[0]);
		return typed;
	}

	/**
	 * @param {string} testId 
	 */
	async getQuestionsOfTest(testId) {
		const result = await Question.findAll({
			where: {
				testId: testId,
			},
		});
		const typeds = result.map((r) => toQuestionModel(r));
		return typeds;
	}

	/**
	 * @param {string} attemptId 
	 * @returns 
	 */
	async getTimeLeft(attemptId) {
		const result = await Attempt.findByPk(attemptId, {
			attributes: ['ID', 'createdAt'],
			include: {
				model: Test,
				attributes: ['minutesToAnswer'],
			}
		});
		if (result == null) {
			throw new Error('Attempt not found');
		}
		const typed = typeCastAttemptSmall(result);
		const endedAt = new Date(typed.createdAt.getTime() + typed.Test.minutesToAnswer * 60 * 1000);
		const timeLeft = endedAt.getTime() - new Date().getTime();
		return timeLeft;
	}

	/**
	 * @param {string} attemptId 
	 * @returns {Promise<AttemptChoiceCast[]>}
	 */
	async getChoicesOfAttempt(attemptId) {
		const result = await AttemptQuestions.findAll({
			where: {
				attemptId: attemptId,
			}
		})
		const typeds = result.map(r => {
			const json = r.toJSON();
			/** @type {AttemptChoiceCast} */
			const typed = {
				questionId: json.questionId,
				optionId: Number(json.chosenOption),
			}
			return typed;
		});
		return typeds;
	}
}

module.exports = RetriverAttempt;