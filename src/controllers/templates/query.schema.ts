import { z } from "zod";
import { PagingSchema, QuerySortOptionsSchema } from "../../shared/controller/schemas/base";

export const TemplatesQuerySchema = PagingSchema.extend({
	search: z.string().optional(),
	sortByCreatedAt: QuerySortOptionsSchema,
	sortByName: QuerySortOptionsSchema,
	filterTags: z.array(z.string()).optional(),
	filterDifficulty: z.array(z.string()).optional(),
});