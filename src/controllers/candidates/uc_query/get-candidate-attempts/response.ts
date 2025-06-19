import { z } from "zod";
import { AttemptCoreSchema } from "../../../../schemas/core/attempt";
import { PagedSchema } from "../../../../shared/controller/schemas/base";

export const GetCandidateAttemptsResponseSchema = PagedSchema(AttemptCoreSchema);
export type GetCandidateAttemptsResponse = z.infer<typeof GetCandidateAttemptsResponseSchema>;
