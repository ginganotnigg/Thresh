import { z } from "zod";
import { AttemptCoreSchema } from "../../../../schemas/core/attempt";
import { PagedSchema } from "../../../../shared/controller/schemas/base";

export const GetTestAttemptsResponseSchema = PagedSchema(AttemptCoreSchema);
export type GetTestAttemptsResponse = z.infer<typeof GetTestAttemptsResponseSchema>;