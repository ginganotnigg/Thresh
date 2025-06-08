import { z } from "zod";
import { PagedSchema, PagingSchema, SortParamSchema } from "../../../shared/controller/schemas/base";
import { AttemptInfoSchema } from "../../../shared/resource/attempt.schema";

export const AttemptsOfTestQuerySchema = PagingSchema.extend({
	sort: SortParamSchema(["createdAt", "score"]),
});

export const AttemptsListSchema = PagedSchema(AttemptInfoSchema);

export const AttemptsOfTestAggregateSchema = z.object({
	totalParticipants: z.number(),
	totalAttempts: z.number(),
	averageScore: z.number(),
	highestScore: z.number(),
	lowestScore: z.number(),
	averageTime: z.number(),
});

export const AttemptsOfCandidateInTestAggregateSchema = z.object({
	candidateId: z.string(),
	rank: z.number(),
	totalAttempts: z.number(),
	averageScore: z.number(),
	highestScore: z.number(),
	lowestScore: z.number(),
	averageTime: z.number(),
});

export const AttemptAggregateSchema = z.object({
	answered: z.number(),
	answeredCorrect: z.number(),
});

export type AttemptsOfTestQuery = z.infer<typeof AttemptsOfTestQuerySchema>;
export type AttemptsList = z.infer<typeof AttemptsListSchema>;
export type AttemptAggregate = z.infer<typeof AttemptAggregateSchema>;
export type AttemptsOfTestAggregate = z.infer<typeof AttemptsOfTestAggregateSchema>;
export type AttemptsOfCandidateInTestAggregate = z.infer<typeof AttemptsOfCandidateInTestAggregateSchema>;