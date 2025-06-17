import { z } from "zod";
import { QueryBooleanSchema } from "../../../shared/controller/schemas/base";

const AttemptAggregateQuerySchema = z.object({
	agg_points: QueryBooleanSchema,
	agg_answered: QueryBooleanSchema,
	agg_answeredCorrect: QueryBooleanSchema,
});

const AttemptIncludeQuerySchema = z.object({
	include_test: QueryBooleanSchema,
});

export const AttemptQueryCoreSchema = z.object({
})
	.merge(AttemptAggregateQuerySchema.partial())
	.merge(AttemptIncludeQuerySchema.partial());


