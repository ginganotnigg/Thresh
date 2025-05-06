import { DomainErrorResponse } from "../../../controller/errors/domain.error";
import Question from "../../../domain/models/question";
import { QuestionCore } from "../../../domain/schema/core.schema";
import { QuestionId } from "../../../domain/schema/id.schema";

export async function questionQuery(param: QuestionId): Promise<QuestionCore> {
	const { questionId } = param;
	const question = await Question.findByPk(questionId);
	if (!question) {
		throw new DomainErrorResponse(`Question with ID ${questionId} not found`);
	}
	return question.toJSON();
}