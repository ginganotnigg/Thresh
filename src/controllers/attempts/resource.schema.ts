import { z } from "zod";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";
import { TestResourceSchema } from "../tests/resource.schema";
import { NonNegativeNumberSchema, PagedSchema } from "../../shared/controller/schemas/base";
import { AnswerResourceSchema } from "./answers/resource.schema";

const AttemptAggregateSchema = z.object({
	points: NonNegativeNumberSchema,
	answered: NonNegativeNumberSchema,
	answeredCorrect: NonNegativeNumberSchema,
});

const AttemptIncludeSchema = z.object({
	test: TestResourceSchema,
	answers: z.array(AnswerResourceSchema),
});

const AttemptCoreSchema = z.object({
	id: z.string(),
	order: z.number().int().positive(),
	testId: z.string(),
	candidateId: z.string(),
	hasEnded: z.boolean(),
	secondsSpent: z.number().int().nonnegative(),
	createdAt: z.date(),
	updatedAt: z.date(),

	_aggregate: AttemptAggregateSchema.partial(),
	_include: AttemptIncludeSchema.partial(),
});

export const AttemptResourceSchema = ChuoiDocument.registerSchema(AttemptCoreSchema.extend({
}), "AttemptResourceSchema");
export const AttemptsResourceSchema = ChuoiDocument.registerSchema(PagedSchema(AttemptCoreSchema).extend({
}), "AttemptsResourceSchema");

export type AttemptResourceSchemaType = z.infer<typeof AttemptResourceSchema>;
export type AttemptsResourceSchemaType = z.infer<typeof AttemptsResourceSchema>;