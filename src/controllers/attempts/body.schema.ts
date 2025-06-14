import { z } from "zod";
import { PostAnswerResourceSchema } from "./answers/resource.schema";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

export const PostAttemptBodySchema = ChuoiDocument.registerSchema(z.object({
	testId: z.string(),
}), "PostAttemptBodySchema");

export const PostAttemptAnswersBodySchema = ChuoiDocument.registerSchema(z.object({
	questionId: z.string(),
	answer: PostAnswerResourceSchema.nullable(),
}), "PostAttemptAnswersBodySchema");