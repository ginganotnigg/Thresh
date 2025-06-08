import { z } from "zod";
import { FeedbackProblemsAsConst } from "../../domain/enum";
import { TestInfoSchema } from "./test.schema";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

export const PracticeTestCoreSchema = ChuoiDocument.registerSchema(
	z.object({
		testId: z.string(),
		difficulty: z.string(),
		tags: z.array(z.string()),
		numberOfQuestions: z.number().int().positive(),
		numberOfOptions: z.number().int().positive(),
		outlines: z.array(z.string()),
	}),
	"PracticeTestCoreSchema"
);
export type PracticeTestCore = z.infer<typeof PracticeTestCoreSchema>;

export const FeedbackCoreSchema = ChuoiDocument.registerSchema(
	z.object({
		practiceTestId: z.string(),
		rating: z.number().min(1).max(10),
		problems: z.array(z.enum(FeedbackProblemsAsConst)).optional().default([]),
		comment: z.string(),
	}),
	"FeedbackCoreSchema"
);
export type FeedbackCore = z.infer<typeof FeedbackCoreSchema>;

export const PracticeTestInfoSchema = ChuoiDocument.registerSchema(
	TestInfoSchema
		.merge(PracticeTestCoreSchema.omit({ testId: true }))
	, "PracticeTestInfoSchema"
);
export type PracticeTestInfo = z.infer<typeof PracticeTestInfoSchema>;

