import { z } from "zod";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";
import { QuestionsResourceSchema } from "../questions/resource.schema";
import { PagedSchema } from "../../shared/controller/schemas/base";
import { TestBaseSchema } from "./base.schema";

const TestAggregateSchema = z.object({
	numberOfQuestions: z.number(),
	totalPoints: z.number(),
	totalParticipants: z.number(),
	totalAttempts: z.number(),
	averageScore: z.number(),
	highestScore: z.number(),
	lowestScore: z.number(),
	averageTime: z.number(),
});

const TestsAggregateSchema = z.object({
	numberOfTests: z.number(),
});

const TestIncludeSchema = z.object({
	questions: z.array(QuestionsResourceSchema),
});

const TestCoreSchema = TestBaseSchema.extend({
	_aggregate: TestAggregateSchema.partial(),
	_include: TestIncludeSchema.partial(),
});

export const TestResourceSchema = ChuoiDocument.registerSchema(TestCoreSchema, "TestResourceSchema");
export const TestsResourceSchema = ChuoiDocument.registerSchema(PagedSchema(TestCoreSchema)
	.extend({
		_aggregate: TestsAggregateSchema.partial().optional(),
	}), "TestsResourceSchema");
