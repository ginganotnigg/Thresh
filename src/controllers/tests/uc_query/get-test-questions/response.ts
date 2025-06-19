import { z } from "zod";
import { QuestionCoreSchema } from "../../../../schemas/core/question";

export const GetTestQuestionsResponseSchema = QuestionCoreSchema.array();
export type GetTestQuestionsResponse = z.infer<typeof GetTestQuestionsResponseSchema>;
