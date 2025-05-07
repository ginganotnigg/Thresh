import { z } from "zod";
import { SortParamSchema, PagingSchema } from "../../../controller/schemas/base";
import { AttemptCoreSchema } from "../../../domain/schema/core.schema";

export const TestAttemptsQuerySchema = z.object({
	sort: SortParamSchema(['createdAt', 'score']).optional().default('-createdAt'),
	authorId: z.string().optional(),
	testId: z.string().optional(),
}).merge(PagingSchema);

export const AttemptAggregateQuerySchema = z.object({
	score: z.boolean().optional(),
	answered: z.boolean().optional(),
	answeredCorrect: z.boolean().optional(),
});

export const AttemptAggregateResponseSchema = z.object({
	score: z.number().optional(),
	answered: z.number().optional(),
	answeredCorrect: z.number().optional(),
});

export const CreateAttemptBodySchema = AttemptCoreSchema
	.pick({
		testId: true,
		candidateId: true,
	})

export const AttemptsCurrentQuerySchema = z.object({
	testId: z.string(),
	candidateId: z.string(),
});

export const AttemptComputeQuerySchema = z.object({
	timeLeft: z.boolean().optional(),
});

export const AttemptComputeResponseSchema = z.object({
	timeLeft: z.number().optional(),
});

export type TestAttemptsQuery = z.infer<typeof TestAttemptsQuerySchema>;
export type AttemptAggregateQuery = z.infer<typeof AttemptAggregateQuerySchema>;
export type AttemptAggregateResponse = z.infer<typeof AttemptAggregateResponseSchema>;
export type CreateAttemptBody = z.infer<typeof CreateAttemptBodySchema>;
export type AttemptsCurrentQuery = z.infer<typeof AttemptsCurrentQuerySchema>;
export type AttemptComputeQuery = z.infer<typeof AttemptComputeQuerySchema>;
export type AttemptComputeResponse = z.infer<typeof AttemptComputeResponseSchema>;