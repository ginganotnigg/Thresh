import { z } from "zod";
import { NonNegativeNumberSchema, PagedSchema } from "../../shared/controller/schemas/base";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";
import { AttemptCoreSchema } from "../core/attempt";

const AttemptOfCandidateSchema = AttemptCoreSchema.omit({
	_aggregate: true,
})

const CandidateAggregateSchema = z.object({
	rank: NonNegativeNumberSchema,
	totalAttempts: NonNegativeNumberSchema,
	averageScore: NonNegativeNumberSchema,
	highestScore: NonNegativeNumberSchema,
	lowestScore: NonNegativeNumberSchema,
	averageTime: NonNegativeNumberSchema,
});

const CandidateIncludeSchema = z.object({
	attempts: z.array(AttemptOfCandidateSchema),
}).partial();

export const CandidateCoreSchema = ChuoiDocument.registerSchema(z.object({
	candidateId: z.string(),
	_aggregate: CandidateAggregateSchema.partial(),
	_include: CandidateIncludeSchema.partial(),
}), "CandidateCoreSchema");

export const CandidatesResourceSchema = ChuoiDocument.registerSchema(PagedSchema(CandidateCoreSchema), "CandidatesResourceSchema");