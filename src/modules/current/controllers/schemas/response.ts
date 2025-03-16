import { z } from 'zod';

// export type CurrentAttemptSmallResponse = {
// 	id: number;
// 	startedAt: Date;
// 	endedAt: Date;
// }

// export type CurrentAttemptDetailResponse = {
// 	id: number;
// 	test: {
// 		id: number;
// 		managerId: string;
// 		title: string;
// 		description: string;
// 		minutesToAnswer: number;
// 		difficulty: string;
// 		createdAt: Date;
// 		updatedAt: Date;
// 	};
// 	questions: {
// 		id: number;
// 		text: string;
// 		options: {
// 			id: number;
// 			text: string;
// 		}[];
// 		points: number;
// 		chosenOption: number;
// 	}[];
// 	startedAt: Date;
// 	endedAt: Date;
// }

export const CurrentAttemptSmallResponseSchema = z.object({
	id: z.number(),
	startedAt: z.date(),
	endedAt: z.date(),
});

export const CurrentAttemptDetailResponseSchema = z.object({
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
		chosenOption: z.number().nullable().openapi({ description: 'The index of the chosen option. If null, the question is not answered yet.' }),
	})),
	startedAt: z.date(),
	endedAt: z.date(),
});

export type CurrentAttemptDetailResponse = z.infer<typeof CurrentAttemptDetailResponseSchema>;
export type CurrentAttemptSmallResponse = z.infer<typeof CurrentAttemptSmallResponseSchema>;