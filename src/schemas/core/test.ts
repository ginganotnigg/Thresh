import { z } from "zod";
import { NonNegativeNumberSchema } from "../../shared/controller/schemas/base";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";
import { TestModeAsConst } from "../../shared/enum";
import { TestDetailCommonSchema } from "../common/test-detail";

const TestAggregateSchema = z.object({
	numberOfQuestions: NonNegativeNumberSchema,
	totalPoints: NonNegativeNumberSchema,
	totalCandidates: NonNegativeNumberSchema,
	totalAttempts: NonNegativeNumberSchema,
	averageScore: NonNegativeNumberSchema,
	highestScore: NonNegativeNumberSchema,
	lowestScore: NonNegativeNumberSchema,
	averageTime: NonNegativeNumberSchema,
});

export const TestCoreSchema = ChuoiDocument.registerSchema(z.object({
	id: z.string(),
	authorId: z.string(),
	title: z.string(),
	description: z.string(),
	minutesToAnswer: z.number().min(1).max(10000),
	language: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	mode: z.enum(TestModeAsConst),
}), "TestCoreSchema");

export const TestFullSchema = ChuoiDocument.registerSchema(TestCoreSchema.extend({
	_aggregate: TestAggregateSchema,
	_detail: TestDetailCommonSchema,
}), "TestFullSchema");

export type TestCore = z.infer<typeof TestCoreSchema>;
export type TestFull = z.infer<typeof TestFullSchema>;