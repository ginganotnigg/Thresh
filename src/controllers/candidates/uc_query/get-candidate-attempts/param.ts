import { z } from "zod";

export const GetCandidateAttemptsQuerySchema = z.object({
	testId: z.string(),
});
export type GetCandidateAttemptsQuery = z.infer<typeof GetCandidateAttemptsQuerySchema>;