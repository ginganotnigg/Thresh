import { z } from "zod";

export const AnswerAttemptBodySchema = z.object({
	questionId: z.coerce.number(),
	optionId: z.coerce.number().optional(),
});

export type AnswerAttemptBody = z.infer<typeof AnswerAttemptBodySchema>;