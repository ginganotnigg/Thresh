import { z } from "zod";
import { TestCoreSchema, QuestionCoreSchema } from "./core.schema";

export const CreateTestBodySchema = z.object({
	test: TestCoreSchema.omit({
		id: true,
		authorId: true,
	}),
	questions: z.array(QuestionCoreSchema.omit({
		id: true,
		testId: true,
	})),
});

export const UpdateTestBodySchema = CreateTestBodySchema.extend({
	testId: z.string(),
});

export type CreateTestBody = z.infer<typeof CreateTestBodySchema>;
export type UpdateTestBody = z.infer<typeof UpdateTestBodySchema>;
