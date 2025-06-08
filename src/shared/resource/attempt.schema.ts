import { z } from "zod";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

export const AttemptCoreSchema = ChuoiDocument.registerSchema(
	z.object({
		id: z.string(),
		order: z.number().int().positive(),
		testId: z.string(),
		candidateId: z.string(),
		hasEnded: z.boolean(),
		secondsSpent: z.number().int().nonnegative(),
		score: z.number().int().nonnegative(),
		createdAt: z.date(),
		updatedAt: z.date(),
	})
	, "AttemptCoreSchema"
);
export type AttemptCore = z.infer<typeof AttemptCoreSchema>;

export const AttemptInfoSchema = ChuoiDocument.registerSchema(
	AttemptCoreSchema
		.extend({
			createdAt: z.date(),
			updatedAt: z.date(),
		})
	, "AttemptInfoSchema"
);
export type AttemptInfo = z.infer<typeof AttemptInfoSchema>;

export const AnswerCoreSchema = ChuoiDocument.registerSchema(
	z.object({
		attemptId: z.string(),
		questionId: z.number(),
		chosenOption: z.number(),
	})
	, "AnswerCoreSchema"
);
export type AnswerCore = z.infer<typeof AnswerCoreSchema>;


