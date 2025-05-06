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

export type GetSelfTestsQuery = z.infer<typeof GetSelfTestsQuerySchema>;
export type GetSelfTestsResponse = z.infer<typeof GetSelfTestsResponseSchema>;

export const QuestionNoAnswerSchema = QuestionCoreSchema.omit({ correctOption: true });

export type QuestionNoAnswer = z.infer<typeof QuestionNoAnswerSchema>;

