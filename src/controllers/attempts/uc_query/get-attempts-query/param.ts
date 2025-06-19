import { z } from "zod";
import { AttemptStatusAsConst } from "../../../../shared/enum";
import { PagingSchema, QueryBooleanSchema } from "../../../../shared/controller/schemas/base";
import { AttemptQueryCoreSchema } from "../../schemas/query.schema";

export const GetAttemptsQueryParamSchema = PagingSchema.extend({
	self: QueryBooleanSchema,
	testId: z.string().optional(),
	candidateId: z.string().optional(),
	status: z.enum(AttemptStatusAsConst).optional(),
}).merge(AttemptQueryCoreSchema);

export type GetAttemptsQueryParam = z.infer<typeof GetAttemptsQueryParamSchema>;
