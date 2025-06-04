import { z } from "zod";
import { PagingSchema, SortParamSchema } from "../../shared/controller/schemas/base";

export const TestsQuerySchema = PagingSchema.extend({
	searchTitle: z.string().optional(),
	sort: SortParamSchema(['createdAt', 'minutesToAnswer', 'title']).optional().default('-createdAt'),
});

export type TestsQuery = z.infer<typeof TestsQuerySchema>;