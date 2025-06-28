import { z } from "zod";
import { PagingSchema } from "../../../../shared/controller/schemas/base";
import { QuerySortOptionsSchema } from '../../../../shared/controller/schemas/query';

export const GetTestParticipantsQuerySchema = PagingSchema.extend({
	sortByRank: QuerySortOptionsSchema,
});

export type GetTestParticipantsQuery = z.infer<typeof GetTestParticipantsQuerySchema>;
