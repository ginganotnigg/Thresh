import { z } from "zod";
import { PostQuestionBodySchema } from "../questions/body.schema";
import { TestResourceSchema } from "./resource.schema";
import { PostPracticeBodySchema } from "./practice/body.schema";
import { PostExamBodySchema } from "./exam/body.schema";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

export const PostTestBodySchema = ChuoiDocument.registerSchema(TestResourceSchema.omit({
	id: true,
	authorId: true,
	child: true,
	_aggregate: true,
	_include: true,
}).extend({
	questions: PostQuestionBodySchema.array().min(1, "At least one question is required"),
	childPost: z.discriminatedUnion("mode", [
		PostPracticeBodySchema,
		PostExamBodySchema,
	]),
}), "PostTestBodySchema");

export const PutTestBodySchema = ChuoiDocument.registerSchema(PostTestBodySchema.partial().omit({
	questions: true,
}).extend({
	questions: PostQuestionBodySchema.array().optional(),
}), "PutTestBodySchema");