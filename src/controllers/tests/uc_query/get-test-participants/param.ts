import { z } from "zod";
import { PagingSchema, QuerySortOptionsSchema } from "../../../../shared/controller/schemas/base";

export const GetTestParticipantsQuerySchema = PagingSchema.extend({
	sortByRank: QuerySortOptionsSchema,
});

export type GetTestParticipantsQuery = z.infer<typeof GetTestParticipantsQuerySchema>;
