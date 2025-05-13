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

