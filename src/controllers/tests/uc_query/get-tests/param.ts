import { z } from "zod";
import { PagingSchema } from "../../../../shared/controller/schemas/base";
import { QuerySortOptionsSchema } from '../../../../shared/controller/schemas/query';
import { TestModeAsConst } from "../../../../shared/enum";

export const GetTestsQuerySchema = PagingSchema.extend({
	mode: z.enum(TestModeAsConst).optional(),
	authorId: z.string().optional(),
	candidateId: z.string().optional(),
	searchTitle: z.string().optional(),
	sortCreatedAt: QuerySortOptionsSchema,
	sortTitle: QuerySortOptionsSchema,
	actions: z.enum(["manage", "view"]).optional().default("manage"),
});

export type GetTestsQuery = z.infer<typeof GetTestsQuerySchema>;
