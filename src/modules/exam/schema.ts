import { z } from "zod";
import { ExamTestCoreSchema } from "../../shared/resource/exam.schema";
import { CreateTestBodySchema } from "../../shared/resource/test.schema";

export const CreateExamBodySchema = CreateTestBodySchema.extend({
	exam: ExamTestCoreSchema.omit({
		testId: true,
		hasPassword: true,
	}).extend({
		password: z.string().optional(),
	})
});

export const UpdateExamBodySchema = CreateExamBodySchema.extend({
	testId: z.string(),
});

export type CreateExamBody = z.infer<typeof CreateExamBodySchema>;
export type UpdateExamBody = z.infer<typeof UpdateExamBodySchema>;