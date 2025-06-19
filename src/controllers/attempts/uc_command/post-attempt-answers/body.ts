import { z } from "zod";
import { ChuoiDocument } from "../../../../library/caychuoijs/documentation/open-api";
import { AnswerForQuestionCommonSchema } from "../../../../schemas/common/answer-for-question-type";

export const PostAttemptAnswersBodySchema = ChuoiDocument.registerSchema(z.object({
	questionId: z.number(),
	answer: AnswerForQuestionCommonSchema.nullable(),
}), "PostAttemptAnswersBodySchema");

export type PostAttemptAnswersBody = z.infer<typeof PostAttemptAnswersBodySchema>;