import { z } from "zod";

export const PracticeResourceSchema = z.object({
	mode: z.literal("PRACTICE"),

	difficulty: z.string(),
	tags: z.array(z.string()),
	numberOfQuestions: z.number().int().positive(),
	numberOfOptions: z.number().int().positive(),
	outlines: z.array(z.string()),
});