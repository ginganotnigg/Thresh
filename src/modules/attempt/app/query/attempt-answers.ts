import { DomainErrorResponse } from "../../../../controller/errors/domain.error";
import Attempt from "../../../../domain/models/attempt";
import AttemptsAnswerQuestions from "../../../../domain/models/attempts_answer_questions";
import { AnswerCore } from "../../../../domain/schema/core.schema";

export async function queryAttemptAnswers(attemptId: string): Promise<AnswerCore[]> {
	const attempt = await Attempt.findByPk(attemptId);
	if (!attempt) {
		throw new DomainErrorResponse("Attempt not found");
	}
	if (attempt.hasEnded === false) {
		throw new DomainErrorResponse("Attempt is not submitted");
	}
	const answers = await AttemptsAnswerQuestions.findAll({
		where: {
			attemptId,
		},
		order: [['questionId', 'ASC']],
	});
	return answers;
}