import { z } from "zod";
import { PagedSchema, PagingSchema, SortParamSchema } from "../../controller/schemas/base";
import { TestPracticeInfoSchema } from "../../domain/schema/info.schema";

export const GetPracticeTestsQuerySchema = PagingSchema.extend({
	authorId: z.string().optional(),
	searchTitle: z.string().optional(),
	sort: SortParamSchema(['createdAt', 'minutesToAnswer', 'title']).optional().default('-createdAt'),
});

export const GetPracticeTestsResponseSchema = PagedSchema(TestPracticeInfoSchema);

export type GetPracticeTestsQuery = z.infer<typeof GetPracticeTestsQuerySchema>;
export type GetPracticeTestsResponse = z.infer<typeof GetPracticeTestsResponseSchema>;