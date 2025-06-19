import { z } from "zod";
import { QuestionTypeType } from "../../../shared/enum";

export const LongAnswerResourceSchema = z.object({
	type: z.literal<QuestionTypeType>("LONG_ANSWER"),

	imageLinks: z.array(z.string()).nullable().optional(),
	extraText: z.string().nullable().optional(),
	correctAnswer: z.string().nullable(),
});
