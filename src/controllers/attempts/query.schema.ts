import { z } from "zod";
import { AttemptStatusAsConst } from "../../domain/enum";
import { PagingSchema, QueryBooleanSchema } from "../../shared/controller/schemas/base";

const AttemptAggregateQuerySchema = z.object({
	agg_points: QueryBooleanSchema,
	agg_answered: QueryBooleanSchema,
	agg_answeredCorrect: QueryBooleanSchema,
});

const AttemptIncludeQuerySchema = z.object({
	include_answers: QueryBooleanSchema,
	include_test: QueryBooleanSchema,
});

const AttemptQueryCoreSchema = z.object({
})
	.merge(AttemptAggregateQuerySchema)
	.merge(AttemptIncludeQuerySchema);

export const AttemptsQuerySchema = PagingSchema.extend({
	self: QueryBooleanSchema,
	common_include_test: QueryBooleanSchema,
	test_id: z.string().optional(),
	candidate_id: z.string().optional(),
	status: z.enum(AttemptStatusAsConst).optional(),
}).merge(AttemptQueryCoreSchema);

export const AttemptQuerySchema = AttemptQueryCoreSchema;