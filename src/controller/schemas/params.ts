import { z } from "zod";

export const TestIdParamsSchema = z.object({
	testId: z.string(),
});

export const QuestionIdParamsSchema = z.object({
	questionId: z.string(),
});

export const AttemptIdParamsSchema = z.object({
	attemptId: z.string(),
});
