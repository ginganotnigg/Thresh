// @ts-check


const Attempt = require("../../../models/attempt");
const Question = require("../../../models/question");
const Test = require("../../../models/test");
const { ATTEMPT_STATUS } = require("../../../utils/const");

class CommandAttempt {
	/**
	 * Create a new attempt for a candidate in a test
	 * @param {string} testId
	 * @param {string} candidateId
	 */
	async createAttemptForCandidate(testId, candidateId) {
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
	 * Update score of an attempt
	 * @param {string} attemptId 
	 * @param {number} score 
	 */
	async updateScore(attemptId, score) {
		await Attempt.update(
			{
				score: score,
				status: ATTEMPT_STATUS.COMPLETED,
				updatedAt: new Date()
			},
			{ where: { ID: attemptId } }
		)
	}

	/**
	 * @param {string} attemptId 
	 * @param {number[]} choices 
	 */
	async updateChoices(attemptId, choices) {
		await Attempt.update(
			{
				choices: choices,
				updatedAt: new Date()
			},
			{ where: { ID: attemptId } }
		)
	}
}

module.exports = CommandAttempt;