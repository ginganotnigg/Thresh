import { z } from "zod";
import { PagedSchema } from "../../shared/controller/schemas/base";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

const TemplateCoreSchema = z.object({
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
});

export const TemplateResourceSchema = ChuoiDocument.registerSchema(TemplateCoreSchema, "TemplateResourceSchema");
export const TemplatesResourceSchema = ChuoiDocument.registerSchema(PagedSchema(TemplateCoreSchema), "TemplatesResourceSchema");
