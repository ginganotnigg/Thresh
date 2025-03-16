import { AttemptStatus } from "../../../common/domain/enum";
import Attempt from "../../../models/attempt";
import AttemptsAnswerQuestions from "../../../models/attempts_answer_questions";

export class WriteRepository {
	static async newAttempt(testId: number, candidateId: string) {
		await Attempt.create({
			testId: +testId,
			candidateId: candidateId,
			status: AttemptStatus.IN_PROGRESS,
			secondsSpent: 0,
		});
	}

	static async endAttempt(attemptId: number, secondsSpent: number) {
		await Attempt.update(
			{
				status: AttemptStatus.COMPLETED,
				secondsSpent: secondsSpent
			},
			{ where: { id: attemptId } }
		);
	}

	/**
	 * Answer a question in an attempt, if optionId is not provided, the answer will be removed
	 */
	static async answerAttempt(attemptId: number, questionId: number, optionId?: number) {
		if (optionId == null) {
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
