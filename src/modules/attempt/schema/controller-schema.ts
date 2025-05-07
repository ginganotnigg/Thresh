import { z } from "zod";
import { SortParamSchema, PagingSchema } from "../../../controller/schemas/base";
import { AttemptCoreSchema } from "../../../domain/schema/core.schema";
import { BooleanStringSchema } from "../../../controller/schemas/query";

export const AttemptsQuerySchema = z.object({
	sort: SortParamSchema(['createdAt', 'score']).optional().default('-createdAt'),
	candidateId: z.string().optional(),
	testId: z.string().optional(),
}).merge(PagingSchema);

export const AttemptAggregateQuerySchema = z.object({
	score: BooleanStringSchema.optional().default("true"),
	answered: BooleanStringSchema.optional().default("true"),
	answeredCorrect: BooleanStringSchema.optional().default("true"),
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
	secondsLeft: BooleanStringSchema.optional().default("true"),
});

export const AttemptComputeResponseSchema = z.object({
	secondsLeft: z.number().optional(),
});

export type AttemptsQuery = z.infer<typeof AttemptsQuerySchema>;
export type AttemptAggregateQuery = z.infer<typeof AttemptAggregateQuerySchema>;
export type AttemptAggregateResponse = z.infer<typeof AttemptAggregateResponseSchema>;
export type CreateAttemptBody = z.infer<typeof CreateAttemptBodySchema>;
export type AttemptsCurrentQuery = z.infer<typeof AttemptsCurrentQuerySchema>;
export type AttemptComputeQuery = z.infer<typeof AttemptComputeQuerySchema>;
export type AttemptComputeResponse = z.infer<typeof AttemptComputeResponseSchema>;
