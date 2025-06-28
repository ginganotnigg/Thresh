import { z } from "zod";
import { QueryBooleanSchema } from '../../../../shared/controller/schemas/query';

export const GetTestQuestionsParamSchema = z.object({
	viewCorrectAnswer: QueryBooleanSchema,
});
export type GetTestQuestionsParam = z.infer<typeof GetTestQuestionsParamSchema>;
