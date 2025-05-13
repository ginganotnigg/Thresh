import { z } from "zod";
import { AttemptCoreSchema, ExamTestCoreSchema, FeedbackCoreSchema, PracticeTestCoreSchema, TestCoreSchema } from "./core.schema";
import { UserCoreSchema } from "../core/proxy/schema";

// Models for client-side usage
// These models are used to define the structure of the data that is sent to the client

export const TestInfoSchema = TestCoreSchema
	.extend({
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

export const TestPracticeInfoSchema = TestInfoSchema
	.merge(PracticeTestCoreSchema.omit({ testId: true }))
	.extend({
		feedback: FeedbackCoreSchema.omit({ practiceTestId: true }).optional(),
	});

export const ExamTestInfoSchema = TestInfoSchema
	.merge(ExamTestCoreSchema.omit({ testId: true }));


export type TestInfo = z.infer<typeof TestInfoSchema>;
export type AttemptInfo = z.infer<typeof AttemptInfoSchema>;
export type TestPracticeInfo = z.infer<typeof TestPracticeInfoSchema>;
export type ExamTestInfo = z.infer<typeof ExamTestInfoSchema>;

