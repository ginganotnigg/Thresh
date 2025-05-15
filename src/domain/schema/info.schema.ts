import { z } from "zod";
import { AttemptCoreSchema, ExamTestCoreSchema, FeedbackCoreSchema, PracticeTestCoreSchema, TestCoreSchema } from "./core.schema";

export const TestInfoSchema = TestCoreSchema
	.extend({
		createdAt: z.date(),
		updatedAt: z.date(),
	});

export const AttemptInfoSchema = AttemptCoreSchema
	.omit({
		testId: true,
	})
	.extend({
		createdAt: z.date(),
		updatedAt: z.date(),
	});

export const PracticeTestInfoSchema = TestInfoSchema
	.merge(PracticeTestCoreSchema.omit({ testId: true }));

export const ExamTestInfoSchema = TestInfoSchema
	.merge(ExamTestCoreSchema.omit({ testId: true }));

export type TestInfo = z.infer<typeof TestInfoSchema>;
export type AttemptInfo = z.infer<typeof AttemptInfoSchema>;
export type PracticeTestInfo = z.infer<typeof PracticeTestInfoSchema>;
export type ExamTestInfo = z.infer<typeof ExamTestInfoSchema>;

