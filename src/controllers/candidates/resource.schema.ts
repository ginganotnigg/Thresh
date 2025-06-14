import { z } from "zod";
import { NonNegativeNumberSchema, PagedSchema } from "../../shared/controller/schemas/base";
import { TestResourceSchema } from "../tests/resource.schema";
import { AttemptResourceSchema } from "../attempts/resource.schema";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

const CandidateAggregateSchema = z.object({
	rank: NonNegativeNumberSchema,
	totalAttempts: NonNegativeNumberSchema,
	averageScore: NonNegativeNumberSchema,
	highestScore: NonNegativeNumberSchema,
	lowestScore: NonNegativeNumberSchema,
	averageTime: NonNegativeNumberSchema,
});

const CandidateIncludeSchema = z.object({
	test: TestResourceSchema,
	attempts: z.array(AttemptResourceSchema),
}).partial();

const CandidatesCoreSchema = z.object({
	candidateId: z.string(),

	_aggregate: CandidateAggregateSchema.partial(),
	_include: CandidateIncludeSchema.partial(),
});

export const CandidatesResourceSchema = ChuoiDocument.registerSchema(PagedSchema(CandidatesCoreSchema), "CandidatesResourceSchema");

export const CandidateResourceSchema = ChuoiDocument.registerSchema(CandidatesCoreSchema, "CandidateResourceSchema");