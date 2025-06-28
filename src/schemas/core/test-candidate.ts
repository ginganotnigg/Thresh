import { z } from "zod";
import { NonNegativeNumberSchema } from '../../shared/controller/schemas/response';
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

const TestCandidateAggregateSchema = z.object({
	rank: NonNegativeNumberSchema,
	totalAttempts: NonNegativeNumberSchema,
	averageScore: NonNegativeNumberSchema,
	highestScore: NonNegativeNumberSchema,
	lowestScore: NonNegativeNumberSchema,
	averageTime: NonNegativeNumberSchema,
});

export const TestCandidateCoreSchema = ChuoiDocument.registerSchema(z.object({
	candidateId: z.string(),
	_aggregate: TestCandidateAggregateSchema,
}), "CandidateCoreSchema");

export type TestCandidateCore = z.infer<typeof TestCandidateCoreSchema>;