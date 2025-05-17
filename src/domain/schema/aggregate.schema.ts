import { z } from "zod";

export const TestAggregateResponseSchema = z.object({
	numberOfQuestions: z.number(),
	totalPoints: z.number(),
});

export type TestAggregateResponse = z.infer<typeof TestAggregateResponseSchema>;