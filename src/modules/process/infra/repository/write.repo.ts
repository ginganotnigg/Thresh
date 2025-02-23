import Attempt from "../../../../models/attempt";
import AttemptsAnswerQuestions from "../../../../models/attempts_answer_questions";
import Test from "../../../../models/test";
import { IWriteRepository } from "../../domain/contracts/write.repo.i";

class WriteRepository implements IWriteRepository {
	async createNewAttemptForCandidate(testId: number, candidateId: string) {
		await Attempt.create({
			testId: +testId,
			candidateId: candidateId,
			score: 0,
			status: ATTEMPT_STATUS.IN_PROGRESS,
		});
		await Test.increment('answerCount', { where: { id: testId } });
	}

	/**
	 * Update score of an attempt
	 */
	async submitAttemptScore(attemptId: number, score: number) {
		await Attempt.update(
			{
				score: score,
				status: ATTEMPT_STATUS.COMPLETED,
				updatedAt: new Date()
			},
			{ where: { id: attemptId } }
		);
	}

	/**
	 * Answer a question in an attempt, if optionId is not provided, the answer will be removed
	 */
	async answerOnAttempt(attemptId: number, questionId: number, optionId?: number) {
		if (!optionId) {
			await AttemptsAnswerQuestions.destroy({
				where: {
					attemptId: attemptId,
					questionId: questionId
				}
			});
			return;
		}
		await AttemptsAnswerQuestions.upsert(
			{
				attemptId: attemptId,
				questionId: questionId,
				chosenOption: optionId,
			},
		);
	}
}

export default WriteRepository;