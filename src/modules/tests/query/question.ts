import { DomainError } from "../../../controller/errors/domain.error";
import Question from "../../../domain/models/question";
import { QuestionCore } from "../../../domain/schema/core.schema";
import { QuestionId } from "../../../domain/schema/id.schema";

export async function queryQuestion(param: QuestionId): Promise<QuestionCore> {
	const { questionId } = param;
	const question = await Question.findByPk(questionId);
	if (!question) {
		throw new DomainError(`Question with ID ${questionId} not found`);
	}
	return question.toJSON();
}