import { z } from "zod";

export const TestIdParamsSchema = z.object({
	testId: z.string(),
});

export const QuestionIdParamsSchema = z.object({
	questionId: z.coerce.number(),
});

export const AttemptIdParamsSchema = z.object({
	attemptId: z.string(),
});

export const UserIdParamsSchema = z.object({
	userId: z.string(),
});