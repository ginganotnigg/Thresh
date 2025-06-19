import { z } from "zod";
import { AttemptCoreSchema } from "../../../../schemas/core/attempt";

export const GetCandidateAttemptsResponseSchema = AttemptCoreSchema.array();
export type GetCandidateAttemptsResponse = z.infer<typeof GetCandidateAttemptsResponseSchema>;
