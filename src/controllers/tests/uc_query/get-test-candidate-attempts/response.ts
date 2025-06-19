import { z } from "zod";
import { AttemptCoreSchema } from "../../../../schemas/core/attempt";
import { PagedSchema } from "../../../../shared/controller/schemas/base";

export const GetTestCandidateAttemptsResponse = PagedSchema(AttemptCoreSchema);
export type GetTestCandidateAttemptsResponse = z.infer<typeof GetTestCandidateAttemptsResponse>;


