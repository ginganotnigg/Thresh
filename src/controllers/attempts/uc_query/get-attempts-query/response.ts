import { z } from "zod";
import { PagedSchema } from "../../../../shared/controller/schemas/base";
import { AttemptCoreSchema } from "../../../../schemas/core/attempt";

export const GetAttemptsResourceResponseSchema = PagedSchema(AttemptCoreSchema);
export type GetAttemptsResourceResponse = z.infer<typeof GetAttemptsResourceResponseSchema>;
