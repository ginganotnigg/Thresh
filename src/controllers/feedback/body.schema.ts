import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";
import { FeedbackResourceSchema } from "./resouce.schema";

export const PostFeedbackBodySchema = ChuoiDocument.registerSchema(FeedbackResourceSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}), "PostFeedbackBodySchema");

export const PutFeedbackBodySchema = ChuoiDocument.registerSchema(PostFeedbackBodySchema
	.partial()
	.extend({
		id: FeedbackResourceSchema.shape.id,
	}), "PutFeedbackBodySchema");