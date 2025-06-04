import { z } from "zod";

export const TestAggregateSchema = z.object({
	numberOfQuestions: z.number(),
	totalPoints: z.number(),
});

export const TestQuestionsAggregateSchema = z.object({
	questionId: z.number(),
	numberOfAnswers: z.number(),
	numberOfCorrectAnswers: z.number(),
	averagePoints: z.number(),
});

export type TestQuestionsAggregate = z.infer<typeof TestQuestionsAggregateSchema>;
export type TestAggregate = z.infer<typeof TestAggregateSchema>;