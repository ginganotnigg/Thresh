import { z } from "zod";
import { ExamTestCoreSchema } from "../../domain/schema/core.schema";
import { CreateTestSchema } from "../../domain/schema/create.schema";

export const CreateExamSchema = CreateTestSchema.extend({
	exam: ExamTestCoreSchema.omit({
		testId: true,
	}),
});

export type CreateExamType = z.infer<typeof CreateExamSchema>;

