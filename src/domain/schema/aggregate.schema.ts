import { z } from "zod";

export const TestAggregateQuerySchema = z.object({
	numberOfQuestions: z.boolean().optional(),
	totalPoints: z.boolean().optional(),
});

export const TestAggregateResponseSchema = z.object({
	numberOfQuestions: z.number().optional(),
	totalPoints: z.number().optional(),
});

export type TestAggregateQuery = z.infer<typeof TestAggregateQuerySchema>;
export type TestAggregateResponse = z.infer<typeof TestAggregateResponseSchema>;