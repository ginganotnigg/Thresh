import { AttemptStatus } from "../../../../common/domain/enum";
import Attempt from "../../../../models/attempt";
import AttemptsAnswerQuestions from "../../../../models/attempts_answer_questions";
import Test from "../../../../models/test";
import { IWriteRepository } from "../../domain/contracts/write.repo.i";

class WriteRepository implements IWriteRepository {
	async createNewAttemptForCandidate(testId: number, candidateId: string) {
		await Attempt.create({
			testId: +testId,
			candidateId: candidateId,
			status: AttemptStatus.IN_PROGRESS,
		});
	}

	/**
	 * Update score of an attempt
	 */
	async submitAttempt(attemptId: number) {
		await Attempt.update(
			{
				status: AttemptStatus.COMPLETED
			},
			{ where: { id: attemptId } }
		);
	}

	/**
	 * Answer a question in an attempt, if optionId is not provided, the answer will be removed
	 */
	async answerOnAttempt(attemptId: number, questionId: number, optionId?: number) {
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

export default WriteRepository;