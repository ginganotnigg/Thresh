import { z } from "zod";

export const GetAttemptAnswersQueryParamSchema = z.void();
export type GetAttemptAnswersQueryParam = z.infer<typeof GetAttemptAnswersQueryParamSchema>;
