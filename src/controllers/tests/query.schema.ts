import { z } from "zod";
import { PagingSchema, QueryBooleanSchema, QuerySortOptionsSchema } from "../../shared/controller/schemas/base";
import { TestModeAsConst } from "../../domain/enum";

const TestAggregateQuerySchema = z.object({
	agg_numberOfQuestions: QueryBooleanSchema,
	agg_totalPoints: QueryBooleanSchema,
	agg_totalParticipants: QueryBooleanSchema,
	agg_totalAttempts: QueryBooleanSchema,
	agg_averageScore: QueryBooleanSchema,
	agg_highestScore: QueryBooleanSchema,
	agg_lowestScore: QueryBooleanSchema,
	agg_averageTime: QueryBooleanSchema,
});

const TestIncludeQuerySchema = z.object({
	include_questions: QueryBooleanSchema,
});

const TestCoreQuerySchema = z.object({})
	.merge(TestAggregateQuerySchema)
	.merge(TestIncludeQuerySchema);

export const TestQuerySchema = z.object({
	viewPassword: QueryBooleanSchema,
})
	.merge(TestCoreQuerySchema);

const TestsAggregateQuerySchema = z.object({
	agg_numberOfTests: QueryBooleanSchema,
});

export const TestsQuerySchema = PagingSchema.extend({
	self: QueryBooleanSchema,

	filterMode: z.enum(TestModeAsConst).optional(),
	searchTitle: z.string().optional(),
	sortCreatedAt: QuerySortOptionsSchema,
	sortTitle: QuerySortOptionsSchema,
})
	.merge(TestsAggregateQuerySchema)
	.merge(TestCoreQuerySchema);