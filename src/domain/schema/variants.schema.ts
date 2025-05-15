import { z } from "zod";
import { QuestionCoreSchema } from "./core.schema";

export const QuestionToDoSchema = QuestionCoreSchema.omit({
	correctOption: true,
});

export type QuestionToDo = z.infer<typeof QuestionToDoSchema>;