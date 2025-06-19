import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";
import { QuestionResourceSchema } from "../../schemas/core/question";

export const PostQuestionBodySchema = ChuoiDocument.registerSchema(QuestionResourceSchema.omit({
	id: true,
	testId: true,
	order: true,
}), "PostQuestionBodySchema");