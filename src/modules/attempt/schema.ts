import { z } from "zod";
import { SortParamSchema, PagingSchema } from "../../controller/schemas/base";
import { QuestionCoreSchema } from "../../domain/schema/core.schema";

export const TestAttemptsQuerySchema = z.object({
	sort: SortParamSchema(['createdAt', 'score']).optional().default('-createdAt'),
	authorId: z.string().optional(),
	testId: z.string().optional(),
}).merge(PagingSchema);

export type TestAttemptsQuery = z.infer<typeof TestAttemptsQuerySchema>;

export const QuestionResultSchema = QuestionCoreSchema
	.omit({
		id: true,
	})
	.extend({
		questionId: z.number(),
		attemptId: z.string(),
		chosenOption: z.number(),
	});

export type QuestionResult = z.infer<typeof QuestionResultSchema>;

const AttemptAggregateQuerySchema = z.object({
	score: z.boolean().optional(),
	answered: z.boolean().optional(),
	answeredCorrect: z.boolean().optional(),
});

const AttemptAggregateResponseSchema = z.object({
	score: z.number().optional(),
	answered: z.number().optional(),
	answeredCorrect: z.number().optional(),
});

export type AttemptAggregateQuery = z.infer<typeof AttemptAggregateQuerySchema>;
export type AttemptAggregateResponse = z.infer<typeof AttemptAggregateResponseSchema>;	