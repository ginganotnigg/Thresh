import { z } from "zod";

export const TestAggregateSchema = z.object({
	numberOfQuestions: z.number(),
	totalPoints: z.number(),
});

export type TestAggregate = z.infer<typeof TestAggregateSchema>;