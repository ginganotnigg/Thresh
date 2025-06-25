import { z } from "zod";
import { AnswerForQuestionCommonSchema } from "../../../../schemas/common/answer-for-question-type";

export const PostAttemptAnswersBodySchema = z.object({
	questionId: z.number(),
	answer: AnswerForQuestionCommonSchema.optional(),
});

export type PostAttemptAnswersBody = z.infer<typeof PostAttemptAnswersBodySchema>;