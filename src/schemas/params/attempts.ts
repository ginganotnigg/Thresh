import { z } from "zod";
import { AttemptStatusAsConst } from "../../shared/enum";
import { PagingSchema } from "../../shared/controller/schemas/base";

export const QueryAttemptsParamSchema = PagingSchema.extend({
	testId: z.string().optional(),
	candidateId: z.string().optional(),
	status: z.enum(AttemptStatusAsConst).optional(),
});

export type QueryAttemptsParam = z.infer<typeof QueryAttemptsParamSchema>;
