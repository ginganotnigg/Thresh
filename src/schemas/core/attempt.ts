import { z } from "zod";
import { NonNegativeNumberSchema } from '../../shared/controller/schemas/response';
import { AttemptStatusAsConst } from "../../shared/enum";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";
import { TestCoreSchema } from "./test";

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
		points: z.number().nonnegative(),
		answered: NonNegativeNumberSchema,
		answeredCorrect: NonNegativeNumberSchema,
	}),
	_include: z.object({
		test: TestCoreSchema
	}),
}), "AttemptCoreSchema");

export type AttemptCore = z.infer<typeof AttemptCoreSchema>;