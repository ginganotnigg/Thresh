import { z } from "zod";
import { LongAnswerResourceSchema } from "./long-answer/resouce.schema";
import { MCQResourceSchema } from "./mcq/resource.schema";

export const QuestionCoreSchema = z.object({
	id: z.number(),
	testId: z.string(),
	order: z.number().int().positive(),
	text: z.string(),
	points: z.number().int().nonnegative(),

	child: z.discriminatedUnion("type", [
		MCQResourceSchema,
		LongAnswerResourceSchema,
	]),
});