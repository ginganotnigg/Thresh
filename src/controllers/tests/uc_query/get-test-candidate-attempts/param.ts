import { z } from "zod";
import { QueryAttemptsParamSchema } from "../../../../schemas/params/attempts";

export const GetTestCandidateAttemptsQuery = QueryAttemptsParamSchema.omit({
	testId: true,
	candidateId: true,
});
export type GetTestCandidateAttemptsQuery = z.infer<typeof GetTestCandidateAttemptsQuery>;
