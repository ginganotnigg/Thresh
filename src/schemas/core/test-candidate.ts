import { z } from "zod";
import { NonNegativeNumberSchema } from '../../shared/controller/schemas/response';
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

const TestCandidateAggregateSchema = z.object({
	rank: z.number().int().nonnegative(),
	totalAttempts: z.number().int().nonnegative(),
	averageScore: z.number().nonnegative(),
	highestScore: z.number().nonnegative(),
	lowestScore: z.number().nonnegative(),
	averageTime: z.number().nonnegative(),
});

export const TestCandidateCoreSchema = ChuoiDocument.registerSchema(z.object({
	candidateId: z.string(),
	_aggregate: TestCandidateAggregateSchema,
}), "CandidateCoreSchema");

export type TestCandidateCore = z.infer<typeof TestCandidateCoreSchema>;