import { z } from "zod";
import { TemplateResourceSchema } from "./resouce.schema";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

export const PostTemplateBodySchema = ChuoiDocument.registerSchema(TemplateResourceSchema.omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
}), "PostTemplateBodySchema");

export const PutTemplateBodySchema = ChuoiDocument.registerSchema(PostTemplateBodySchema
	.partial()
	.extend({
		id: z.string(),
	}), "PutTemplateBodySchema");

