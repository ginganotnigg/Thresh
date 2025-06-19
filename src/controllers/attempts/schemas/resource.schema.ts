import { z } from "zod";
import { NonNegativeNumberSchema } from "../../../shared/controller/schemas/base";
import { AttemptStatusAsConst, TestModeAsConst } from "../../../shared/enum";
import { TestBaseSchema } from "../../tests/base.schema";

const TestOfAttemptSchema = TestBaseSchema.omit({
	child: true,
}).extend({
	mode: z.enum(TestModeAsConst)
});

const AttemptAggregateSchema = z.object({
	points: NonNegativeNumberSchema,
	answered: NonNegativeNumberSchema,
	answeredCorrect: NonNegativeNumberSchema,
});

export const AttemptCoreSchema = z.object({
	id: z.string(),
	order: z.number().int().positive(),
	testId: z.string(),
	candidateId: z.string(),
	hasEnded: z.boolean(),
	status: z.enum(AttemptStatusAsConst),
	secondsSpent: z.number().int().nonnegative(),
	createdAt: z.date(),
	updatedAt: z.date(),

	_aggregate: AttemptAggregateSchema.partial(),
	_include: z.object({
		test: TestOfAttemptSchema
	}).partial().optional(),
});
