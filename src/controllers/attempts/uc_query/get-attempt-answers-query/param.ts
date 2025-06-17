import { z } from "zod";

export const GetAttemptAnswersQueryParamSchema = z.object({
});

export type GetAttemptAnswersQueryParam = z.infer<typeof GetAttemptAnswersQueryParamSchema>;