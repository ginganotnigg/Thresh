import { z } from "zod";
import { PagingSchema, QueryBooleanSchema, QuerySortOptionsSchema, sortBy, SortParamSchema } from "../../../../shared/controller/schemas/base";

export const GetTestCandidatesQuerySchema = PagingSchema.extend({
	sortByRank: QuerySortOptionsSchema,
});

export type GetTestCandidatesQuery = z.infer<typeof GetTestCandidatesQuerySchema>;
