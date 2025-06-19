import { z } from "zod";
import { PostQuestionBodySchema } from "../questions/body.schema";
import { TestResourceSchema } from "./resource.schema";
import { PostPracticeBodySchema } from "./practice/body.schema";
import { PostExamBodySchema } from "./exam/body.schema";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";



export const PutTestBodySchema = ChuoiDocument.registerSchema(PostTestBodySchema.partial().omit({
	questions: true,
}).extend({
	questions: PostQuestionBodySchema.array().optional(),
}), "PutTestBodySchema");