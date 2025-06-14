import { z } from "zod";
import { QueryBooleanSchema } from "../../shared/controller/schemas/base";

const QuestionAggregateQuerySchema = z.object({
	agg_numberOfAnswers: QueryBooleanSchema,
	agg_numberOfCorrectAnswers: QueryBooleanSchema,
	agg_averageScore: QueryBooleanSchema,
});

const QuestionIncludeQuerySchema = z.object({
	test: QueryBooleanSchema,
	answers: QueryBooleanSchema,
});

const QuestionViewQuerySchema = z.object({
	viewCorrectAnswers: QueryBooleanSchema,
});

const QuestionQueryCoreSchema = z.object({
	testId: z.string(),
})
	.merge(QuestionAggregateQuerySchema)
	.merge(QuestionIncludeQuerySchema)
	.merge(QuestionViewQuerySchema);

export const QuestionQuerySchema = QuestionQueryCoreSchema;
export const QuestionsQuerySchema = QuestionQueryCoreSchema;
