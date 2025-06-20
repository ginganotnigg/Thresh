import { z } from "zod";
import { PagedSchema, PagingSchema, QuerySortOptionsSchema } from "../../shared/controller/schemas/base";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

const TemplateCoreSchema = ChuoiDocument.registerSchema(z.object({
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
}), "TemplateCoreSchema");

export const GetTemplatesQuerySchema = PagingSchema.extend({
	search: z.string().optional(),
	sortByCreatedAt: QuerySortOptionsSchema,
	sortByName: QuerySortOptionsSchema,
	filterTags: z.array(z.string()).optional(),
	filterDifficulty: z.array(z.string()).optional(),
});

export const PostTemplateBodySchema = TemplateCoreSchema.omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
});

export const PutTemplateBodySchema = PostTemplateBodySchema.extend({
	id: z.string(),
});

export const GetTemplateResponseSchema = TemplateCoreSchema;
export const GetTemplatesResponseSchema = PagedSchema(TemplateCoreSchema);


export type TemplateCore = z.infer<typeof TemplateCoreSchema>;

export type GetTemplatesQuery = z.infer<typeof GetTemplatesQuerySchema>;
export type PostTemplateBody = z.infer<typeof PostTemplateBodySchema>;
export type PutTemplateBody = z.infer<typeof PutTemplateBodySchema>;
export type GetTemplateResponse = z.infer<typeof GetTemplateResponseSchema>;
export type GetTemplatesResponse = z.infer<typeof GetTemplatesResponseSchema>;
