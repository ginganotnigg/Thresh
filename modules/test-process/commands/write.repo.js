// @ts-check


const Attempt = require("../../../models/attempt");
const AttemptQuestions = require("../../../models/attempt_questions");
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
		const questions = await Question.findAll({
			where: { testId: testId },
		});
		await Attempt.create({
			testId: +testId,
			candidateId: candidateId,
			score: 0,
			status: ATTEMPT_STATUS.IN_PROGRESS,
			createdAt: new Date(),
			updatedAt: new Date(),
			AttemptQuestions: questions.map((question) => ({
				questionId: question.get("ID"),
				chosenOption: -1,
				createdAt: new Date(),
				updatedAt: new Date(),
			}))
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
	 * @param {string} questionId
	 * @param {number} optionId
	 */
	async updateChoices(attemptId, questionId, optionId) {
		await AttemptQuestions.update(
			{
				chosenOption: optionId,
				updatedAt: new Date()
			},
			{
				where: {
					attemptId: attemptId,
					questionId: questionId
				}
			}
		);
	}
}

module.exports = CommandAttempt;