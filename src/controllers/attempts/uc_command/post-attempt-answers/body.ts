import { z } from "zod";
import { ChuoiDocument } from "../../../../library/caychuoijs/documentation/open-api";
import { AnswerForQuestionTypeSchema } from "../../schemas/answer-resource.schema";

export const PostAttemptAnswersBodySchema = ChuoiDocument.registerSchema(z.object({
	questionId: z.number(),
	answer: AnswerForQuestionTypeSchema.nullable(),
}), "PostAttemptAnswersBodySchema");

export type PostAttemptAnswersBody = z.infer<typeof PostAttemptAnswersBodySchema>;