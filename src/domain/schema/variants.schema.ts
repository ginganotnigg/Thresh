import { z } from "zod";
import { QuestionCoreSchema } from "./core.schema";

export const QuestionNoAnswerSchema = QuestionCoreSchema.omit({
	correctOption: true,
});

export type QuestionNoAnswer = z.infer<typeof QuestionNoAnswerSchema>;