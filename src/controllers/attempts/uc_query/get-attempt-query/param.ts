import { z } from "zod";

export const GetAttemptQueryParamSchema = z.void();
export type GetAttemptQueryParam = z.infer<typeof GetAttemptQueryParamSchema>;
