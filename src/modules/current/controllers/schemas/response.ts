import { z } from 'zod';

export const CurrentAttemptStateResponseSchema = z.object({
	hasCurrentAttempt: z.boolean(),
	currentAttempt: z.object({
		id: z.number(),
		secondsLeft: z.number(),
		createdAt: z.date(),
		endedAt: z.date(),
		answers: z.array(z.object({
			questionId: z.number(),
			chosenOption: z.number(),
		})),
		test: z.object({
			id: z.number(),
			title: z.string(),
			minutesToAnswer: z.number(),
		}),
	}).nullable(),
});

export const TestDetailToDoResponseSchema = z.object({
	id: z.number(),
	test: z.object({
		id: z.number(),
		managerId: z.string(),
		title: z.string(),
		description: z.string(),
		minutesToAnswer: z.number(),
		difficulty: z.string(),
		createdAt: z.date(),
		updatedAt: z.date(),
	}),
	questions: z.array(z.object({
		id: z.number(),
		text: z.string(),
		options: z.array(z.object({
			id: z.number(),
			text: z.string(),
		})),
		points: z.number(),
	})),
});

export type TestDetailToDoResponse = z.infer<typeof TestDetailToDoResponseSchema>;
export type CurrentAttemptStateResponse = z.infer<typeof CurrentAttemptStateResponseSchema>;