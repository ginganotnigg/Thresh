import { z } from "zod";
import { PagedSchema, PagingSchema, SortParamSchema } from "../../../controller/schemas/base";
import { AttemptInfoSchema } from "../../../domain/schema/info.schema";

export const AttemptsOfExamQuerySchema = PagingSchema.extend({
	sort: SortParamSchema(["createdAt", "score"]),
});

export const AttemptsListSchema = PagedSchema(AttemptInfoSchema);

export const AttemptsOfExamAggregateSchema = z.object({
	candidateRank: z.number().optional(),
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

export type AttemptsOfExamQuery = z.infer<typeof AttemptsOfExamQuerySchema>;
export type AttemptsList = z.infer<typeof AttemptsListSchema>;
export type AttemptsOfExamAggregate = z.infer<typeof AttemptsOfExamAggregateSchema>;
export type AttemptAggregate = z.infer<typeof AttemptAggregateSchema>;