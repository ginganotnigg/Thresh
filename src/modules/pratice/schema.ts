import { z } from "zod";
import { PracticeTestCoreSchema } from "../../shared/resource/practice.schema";
import { CreateTestBodySchema } from "../../shared/resource/test.schema";
import { PagingSchema } from "../../shared/controller/schemas/base";
import { FeedbackProblemsAsConst } from "../../shared/enum";

export const CreatePracticeBodySchema = CreateTestBodySchema.extend({
	practice: PracticeTestCoreSchema.omit({
		testId: true,
	}),
});

export const UpdatePracticeBodySchema = CreatePracticeBodySchema.extend({
	testId: z.string(),
});

export const TemplatesQuerySchema = z.object({
	searchName: z.string().optional(),
}).merge(PagingSchema);

export const CreateTemplateBodySchema = z.object({
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
});

export const UpdateTemplateBodySchema = CreateTemplateBodySchema.partial();

export const CreateFeedbackBodySchema = z.object({
	rating: z.number().min(1).max(10),
	problems: z.array(z.enum(FeedbackProblemsAsConst)).optional().default([]),
	comment: z.string().optional().default(""),
});

export const UpdateFeedbackBodySchema = CreateFeedbackBodySchema.partial().extend({
});

export type CreatePracticeBody = z.infer<typeof CreatePracticeBodySchema>;
export type UpdatePracticeBody = z.infer<typeof UpdatePracticeBodySchema>;

export type TemplatesQuery = z.infer<typeof TemplatesQuerySchema>;
export type CreateTemplateBody = z.infer<typeof CreateTemplateBodySchema>;
export type UpdateTemplateBody = z.infer<typeof UpdateTemplateBodySchema>;

export type CreateFeedbackBody = z.infer<typeof CreateFeedbackBodySchema>;
export type UpdateFeedbackBody = z.infer<typeof UpdateFeedbackBodySchema>;
