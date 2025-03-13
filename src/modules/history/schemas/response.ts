import { z } from 'zod';

const AttemptItemResultSchema = z.object({
	id: z.number(),
	test: z.object({
		id: z.number(),
		managerId: z.string(),
		title: z.string(),
		minutesToAnswer: z.number(),
		tags: z.array(z.string()),
	}),
	candidateId: z.string(),
	startDate: z.date(),
	timeSpent: z.number(),
	score: z.number(),
	totalScore: z.number(),
});

const AttemptResultSchema = AttemptItemResultSchema.extend({
	totalCorrectAnswers: z.number(),
	totalWrongAnswers: z.number(),
	totalQuestions: z.number(),
});

const AnswerQuestionResultSchema = z.object({
	question: z.object({
		id: z.number(),
		text: z.string(),
		options: z.array(z.string()),
		points: z.number(),
		correctOption: z.number(),
	}),
	chosenOption: z.number().nullable(),
});

export { AttemptItemResultSchema, AttemptResultSchema, AnswerQuestionResultSchema };
export type AttemptItemResult = z.infer<typeof AttemptItemResultSchema>;
export type AttemptResult = z.infer<typeof AttemptResultSchema>;
export type AnswerQuestionResult = z.infer<typeof AnswerQuestionResultSchema>;