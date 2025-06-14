import { z } from "zod";
import { PagingSchema, QueryBooleanSchema } from "../../shared/controller/schemas/base";

const CandidateAggregateQuerySchema = z.object({
	agg_rank: QueryBooleanSchema,
	agg_totalAttempts: QueryBooleanSchema,
	agg_averageScore: QueryBooleanSchema,
	agg_highestScore: QueryBooleanSchema,
	agg_lowestScore: QueryBooleanSchema,
	agg_averageTime: QueryBooleanSchema,
});

const CandidateIncludeQuerySchema = z.object({
	include_test: QueryBooleanSchema,
	include_attempts: QueryBooleanSchema,
});

const CandidateCoreQuerySchema = z.object({})
	.merge(CandidateAggregateQuerySchema)
	.merge(CandidateIncludeQuerySchema);

export const CandidatesQuerySchema = PagingSchema.extend({
	testId: z.string().optional(),
}).merge(CandidateCoreQuerySchema)

export const CandidateQuerySchema = CandidateCoreQuerySchema;