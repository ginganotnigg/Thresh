import { z } from "zod";
import { PagedSchema, PagingSchema, SortParamSchema } from "../../controller/schemas/base";
import { TestInfoSchema } from "../../domain/schema/info.schema";
import { QuestionCoreSchema } from "../../domain/schema/core.schema";
import { BooleanStringSchema } from "../../controller/schemas/query";

export const GetTestsQuerySchema = PagingSchema.extend({
	authorId: z.string().optional(),
	searchTitle: z.string().optional(),
	sort: SortParamSchema(['createdAt', 'minutesToAnswer', 'title']).optional().default('-createdAt'),
});

export const GetTestsResponseSchema = PagedSchema(TestInfoSchema);

export const QuestionNoAnswerSchema = QuestionCoreSchema.omit({ correctOption: true });

export const TestAggregateQuerySchema = z.object({
	numberOfQuestions: BooleanStringSchema.optional().default("true"),
	totalPoints: BooleanStringSchema.optional().default("true"),
});

export const TestAggregateResponseSchema = z.object({
	numberOfQuestions: z.number().optional(),
	totalPoints: z.number().optional(),
});

export type GetTestsQuery = z.infer<typeof GetTestsQuerySchema>;
export type GetTestsResponse = z.infer<typeof GetTestsResponseSchema>;
export type QuestionNoAnswer = z.infer<typeof QuestionNoAnswerSchema>;
export type TestAggregateQuery = z.infer<typeof TestAggregateQuerySchema>;
export type TestAggregateResponse = z.infer<typeof TestAggregateResponseSchema>;

