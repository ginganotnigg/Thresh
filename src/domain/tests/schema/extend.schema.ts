import { z } from "zod";
import { QuestionCoreSchema } from "./core.schema";

export const TestInfoSchema = z.object({
	id: z.string(),
	author: z.object({
		id: z.string(),
		name: z.string(),
		avatar: z.string().optional(),
	}),
	title: z.string(),
	description: z.string(),
	minutesToAnswer: z.number(),
	language: z.string(),
	mode: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const QuestionNoAnswerSchema = QuestionCoreSchema.omit({ correctOption: true });

export type TestInfo = z.infer<typeof TestInfoSchema>;
export type QuestionNoAnswer = z.infer<typeof QuestionNoAnswerSchema>;
