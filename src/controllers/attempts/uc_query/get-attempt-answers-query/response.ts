import { z } from "zod";
import { AnswerCoreSchema } from "../../../../schemas/core/answer";

export const GetAttemptAnswersResponseSchema = AnswerCoreSchema.array();
export type GetAttemptAnswersResponse = z.infer<typeof GetAttemptAnswersResponseSchema>;
