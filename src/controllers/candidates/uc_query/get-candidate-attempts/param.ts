import { z } from "zod";
import { PagingSchema } from "../../../../shared/controller/schemas/base";

export const GetCandidateAttemptsQuerySchema = PagingSchema.extend({
	testId: z.string().optional(),
});
export type GetCandidateAttemptsQuery = z.infer<typeof GetCandidateAttemptsQuerySchema>;