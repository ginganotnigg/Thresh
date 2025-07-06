import { z } from "zod";
import { AnswerForQuestionCommonSchema } from "../../../../schemas/common/answer-for-question-type";

export const PostAttemptAnswersBodySchema = z.object({
	answers: z.array(
		z.object({
			questionId: z.number(),
			answer: AnswerForQuestionCommonSchema.nullish(),
		})
	),
});

export type PostAttemptAnswersBody = z.infer<typeof PostAttemptAnswersBodySchema>;