import { z } from "zod";
import { FeedbackProblemsAsConst } from "../../shared/enum";
import { PagedSchema, QuerySortOptionsSchema } from "../../shared/controller/schemas/base";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

const FeedbackCoreSchema = ChuoiDocument.registerSchema(z.object({
	id: z.string(),
	testId: z.string(),
	rating: z.number().min(1).max(10),
	problems: z.array(z.enum(FeedbackProblemsAsConst)).optional().default([]),
	comment: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
}), "FeedbackCoreSchema");

export const GetFeedbacksQuerySchema = z.object({
	testId: z.string(),
	sortByCreatedAt: QuerySortOptionsSchema,
	sortByRating: QuerySortOptionsSchema,
	filterByProblems: z.array(z.string()).optional(),
});

export const PostFeedbackBodySchema = FeedbackCoreSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

export const PutFeedbackBodySchema = PostFeedbackBodySchema.extend({
	id: z.string(),
})

export const GetFeedbackResponseSchema = FeedbackCoreSchema;
export const GetFeedbacksResponseSchema = PagedSchema(FeedbackCoreSchema);

export type GetFeedbackResponse = z.infer<typeof GetFeedbackResponseSchema>;
export type GetFeedbacksResponse = z.infer<typeof GetFeedbacksResponseSchema>;
export type PostFeedbackBody = z.infer<typeof PostFeedbackBodySchema>;
export type PutFeedbackBody = z.infer<typeof PutFeedbackBodySchema>;
export type GetFeedbacksQuery = z.infer<typeof GetFeedbacksQuerySchema>;
export type FeedbackCore = z.infer<typeof FeedbackCoreSchema>;

