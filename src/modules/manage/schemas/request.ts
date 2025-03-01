import { z } from "zod";
import { TestDifficulty } from "../../../common/domain/enum";
import Question from "../../../models/question";

const TestFilterQuerySchema = z.object({
	searchTitle: z.string().optional(),
	minMinutesToAnswer: z.number().optional(),
	maxMinutesToAnswer: z.number().optional(),
	difficulty: z.array(z.nativeEnum(TestDifficulty)).optional(),
	tags: z.array(z.number()).optional(),
	page: z.number().min(1),
	perPage: z.number().optional().default(5),
});

const QuestionCreateBodySchema = z.object({
	text: z.string(),
	options: z.array(z.string()),
	points: z.number(),
	correctOption: z.number(),
});

const TestCreateBodySchema = z.object({
	tagIds: z.array(z.number()),
	title: z.string(),
	description: z.string(),
	difficulty: z.nativeEnum(TestDifficulty),
	minutesToAnswer: z.number().min(1).max(10000),
	questions: z.array(QuestionCreateBodySchema),
});

const TestUpdateBodySchema = z.object({
	tagIds: z.array(z.number()).optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	difficulty: z.nativeEnum(TestDifficulty).optional(),
	minutesToAnswer: z.number().min(1).max(10000).optional(),
	questions: z.array(z.instanceof(Question)).optional(),
});

export {
	TestFilterQuerySchema,
	QuestionCreateBodySchema,
	TestCreateBodySchema,
	TestUpdateBodySchema,
};

export type TestFilterQuery = z.infer<typeof TestFilterQuerySchema>;
export type QuestionCreateBody = z.infer<typeof QuestionCreateBodySchema>;
export type TestCreateBody = z.infer<typeof TestCreateBodySchema>;
export type TestUpdateBody = z.infer<typeof TestUpdateBodySchema>;