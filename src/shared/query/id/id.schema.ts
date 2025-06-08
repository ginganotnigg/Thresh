import { z } from "zod";

export const TestIdSchema = z.object({
	testId: z.string(),
});

export const QuestionIdSchema = z.object({
	questionId: z.number(),
});

export const AttemtpIdSchema = z.object({
	attemptId: z.string(),
});

export type TestId = z.infer<typeof TestIdSchema>;
export type QuestionId = z.infer<typeof QuestionIdSchema>;
export type AttemptId = z.infer<typeof AttemtpIdSchema>;
