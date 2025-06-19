import { z } from "zod";
import { NonNegativeNumberSchema } from "../../shared/controller/schemas/base";
import { AttemptStatusAsConst, TestModeAsConst } from "../../shared/enum";
import { TestBaseSchema } from "../../controllers/tests/base.schema";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

const TestOfAttemptSchema = TestBaseSchema.omit({
	child: true,
}).extend({
	mode: z.enum(TestModeAsConst)
});

export const AttemptCoreSchema = ChuoiDocument.registerSchema(z.object({
	id: z.string(),
	order: z.number().int().positive(),
	testId: z.string(),
	candidateId: z.string(),
	hasEnded: z.boolean(),
	status: z.enum(AttemptStatusAsConst),
	secondsSpent: z.number().int().nonnegative(),
	createdAt: z.date(),
	updatedAt: z.date(),

	_aggregate: z.object({
		points: NonNegativeNumberSchema,
		answered: NonNegativeNumberSchema,
		answeredCorrect: NonNegativeNumberSchema,
	}),
	_include: z.object({
		test: TestOfAttemptSchema
	}),
}), "AttemptCoreSchema");

export type AttemptCore = z.infer<typeof AttemptCoreSchema>;