import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";
import { QuestionResourceSchema } from "./resource.schema";

export const PostQuestionBodySchema = ChuoiDocument.registerSchema(QuestionResourceSchema.omit({
	id: true,
	testId: true,
	order: true,
}), "PostQuestionBodySchema");