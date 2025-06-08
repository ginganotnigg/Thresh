import { z } from "zod";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

export const QuestionCoreSchema = ChuoiDocument.registerSchema(z.object({
	id: z.number(),
	testId: z.string(),
	text: z.string(),
	options: z.array(z.string()),
	points: z.number(),
	correctOption: z.number(),
}), "QuestionCoreSchema");
export type QuestionCore = z.infer<typeof QuestionCoreSchema>;

export const QuestionToDoSchema = ChuoiDocument.registerSchema(QuestionCoreSchema.omit({
	correctOption: true,
}), "QuestionToDoSchema");
export type QuestionToDo = z.infer<typeof QuestionToDoSchema>;
