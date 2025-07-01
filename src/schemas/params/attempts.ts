import { z } from "zod";
import { AttemptStatusAsConst } from "../../shared/enum";
import { PagingSchema } from "../../shared/controller/schemas/base";
import { QuerySortOptionsSchema } from "../../shared/controller/schemas/query";

export const QueryAttemptsParamSchema = PagingSchema.extend({
	testId: z.string().optional(),
	candidateId: z.string().optional(),
	status: z.enum(AttemptStatusAsConst).optional(),
	sortByPoints: QuerySortOptionsSchema.optional(),
	sortByCreatedAt: QuerySortOptionsSchema.optional(),
	sortBySecondsSpent: QuerySortOptionsSchema.optional(),
});

export type QueryAttemptsParam = z.infer<typeof QueryAttemptsParamSchema>;
