import { z } from "zod";
import { QuestionCoreSchema } from "../../../domain/schema/core.schema";


export const QuestionResultSchema = QuestionCoreSchema
	.omit({
		id: true,
	})
	.extend({
		questionId: z.number(),
		attemptId: z.string(),
		chosenOption: z.number(),
	}); export type QuestionResult = z.infer<typeof QuestionResultSchema>;
