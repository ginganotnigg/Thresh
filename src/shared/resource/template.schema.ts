import { z } from "zod";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

export const TemplateCoreSchema = ChuoiDocument.registerSchema(
	z.object({
		id: z.string(),
		userId: z.string(),
		name: z.string(),
		title: z.string(),
		description: z.string(),
		language: z.string(),
		minutesToAnswer: z.number().min(1).max(10000),
		difficulty: z.string(),
		tags: z.array(z.string()),
		numberOfQuestions: z.number(),
		numberOfOptions: z.number(),
		outlines: z.array(z.string()),
		createdAt: z.date(),
		updatedAt: z.date(),
	}),
	"TemplateCoreSchema"
);
export type TemplateCore = z.infer<typeof TemplateCoreSchema>;