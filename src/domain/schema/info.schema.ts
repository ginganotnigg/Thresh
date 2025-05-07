import { z } from "zod";
import { AttemptCoreSchema, TestCoreSchema, UserCoreSchema } from "./core.schema";

// Models for client-side usage
// These models are used to define the structure of the data that is sent to the client

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
