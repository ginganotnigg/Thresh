import { z } from "zod";
import { TestCoreSchema, QuestionCoreSchema, ExamTestCoreSchema } from "./core.schema";


export const CreateTestSchema = z.object({
	test: TestCoreSchema.omit({
		id: true,
	}),
	questions: z.array(QuestionCoreSchema.omit({
		id: true,
		testId: true,
	})),
});

export type CreateTestType = z.infer<typeof CreateTestSchema>;

