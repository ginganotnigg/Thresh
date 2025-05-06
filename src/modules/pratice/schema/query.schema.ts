import { z } from "zod";
import { PagedSchema, PagingSchema, SortParamSchema } from "../../../controller/schemas/base";
import { TestInfoSchema } from "../../../domain/tests/schema/extend.schema";

export const GetSelfTestsQuerySchema = PagingSchema.extend({
	authorId: z.string(),
	searchTitle: z.string().optional(),
	sort: SortParamSchema(['createdAt', 'minutesToAnswer', 'title']).optional().default('-createdAt'),
});

export const GetSelfTestsResponseSchema = PagedSchema(TestInfoSchema);

export const TestIdSchema = z.object({
	testId: z.string(),
});

export const QuestionIdSchema = z.object({
	questionId: z.number(),
});

export type GetSelfTestsQuery = z.infer<typeof GetSelfTestsQuerySchema>;
export type GetSelfTestsResponse = z.infer<typeof GetSelfTestsResponseSchema>;

export type TestId = z.infer<typeof TestIdSchema>;
export type QuestionId = z.infer<typeof QuestionIdSchema>;