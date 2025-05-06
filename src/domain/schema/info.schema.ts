import { z } from "zod";
import { AttemptCoreSchema, TestCoreSchema, UserCoreSchema } from "./core.schema";

export const TestInfoSchema = TestCoreSchema
	.omit({ authorId: true })
	.extend({
		author: z.object({
			id: z.string(),
			name: z.string(),
			avatar: z.string().optional(),
		}),
		createdAt: z.date(),
		updatedAt: z.date(),
	});

export const AttemptInfoSchema = AttemptCoreSchema
	.omit({
		candidateId: true,
		testId: true,
	})
	.extend({
		candidate: UserCoreSchema,
		test: TestInfoSchema,
		createdAt: z.date(),
		updatedAt: z.date(),
	});

export type TestInfo = z.infer<typeof TestInfoSchema>;
export type AttemptInfo = z.infer<typeof AttemptInfoSchema>;
