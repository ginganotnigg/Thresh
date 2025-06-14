import { ExamResourceSchema } from "./resource.schema";

export const PostExamBodySchema = ExamResourceSchema.omit({
	hasPassword: true,
});