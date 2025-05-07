import { DomainErrorResponse } from "../../../controller/errors/domain.error";
import AttemptsAnswerQuestions from "../../../domain/models/attempts_answer_questions";
import Question from "../../../domain/models/question";
import { QuestionResult } from "../schema/domain-schema";

export async function queryAttemptAnswers(attemptId: string): Promise<QuestionResult[]> {
	const answers = await AttemptsAnswerQuestions.findAll({
		where: {
			attemptId,
		},
		include: [
			{
				model: Question,
				attributes: { exclude: ['id'] },
			}
		],
		order: [['questionId', 'ASC']],
	});

	if (!answers || answers.length === 0) {
		throw new DomainErrorResponse(`No answers found for attempt with id ${attemptId}`);
	}

	return answers.map((answer) => ({
		...answer.Question!.toJSON(),
		...answer.toJSON(),
	}));
}