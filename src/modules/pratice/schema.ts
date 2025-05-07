import { z } from "zod";
import { PagedSchema, PagingSchema, SortParamSchema } from "../../controller/schemas/base";
import { TestInfoSchema } from "../../domain/schema/info.schema";
import { QuestionCoreSchema } from "../../domain/schema/core.schema";

export const GetSelfTestsQuerySchema = PagingSchema.extend({
	authorId: z.string(),
	searchTitle: z.string().optional(),
	sort: SortParamSchema(['createdAt', 'minutesToAnswer', 'title']).optional().default('-createdAt'),
});

export const GetSelfTestsResponseSchema = PagedSchema(TestInfoSchema);

export const QuestionNoAnswerSchema = QuestionCoreSchema.omit({ correctOption: true });

export const TestAggregateQuerySchema = z.object({
	numberOfQuestions: z.boolean().optional(),
});

export const TestAggregateResponseSchema = z.object({
	numberOfQuestions: z.number().optional(),
});

export type GetSelfTestsQuery = z.infer<typeof GetSelfTestsQuerySchema>;
export type GetSelfTestsResponse = z.infer<typeof GetSelfTestsResponseSchema>;
export type QuestionNoAnswer = z.infer<typeof QuestionNoAnswerSchema>;
export type TestAggregateQuery = z.infer<typeof TestAggregateQuerySchema>;
export type TestAggregateResponse = z.infer<typeof TestAggregateResponseSchema>;

