import { z } from "zod";
import { PagingSchema, QuerySortOptionsSchema } from "../../../../shared/controller/schemas/base";
import { TestModeAsConst } from "../../../../shared/enum";

export const GetTestsQuerySchema = PagingSchema.extend({
	mode: z.enum(TestModeAsConst).optional(),
	authorId: z.string().optional(),
	candidateId: z.string().optional(),
	searchTitle: z.string().optional(),
	sortCreatedAt: QuerySortOptionsSchema,
	sortTitle: QuerySortOptionsSchema,
});
export type GetTestsQuery = z.infer<typeof GetTestsQuerySchema>;
