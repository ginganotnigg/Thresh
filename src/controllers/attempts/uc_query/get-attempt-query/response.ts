import { z } from "zod";
import { AttemptCoreSchema } from "../../../../schemas/core/attempt";

export const GetAttemptQueryResponseSchema = AttemptCoreSchema;
export type GetAttemptQueryResponse = z.infer<typeof GetAttemptQueryResponseSchema>;
