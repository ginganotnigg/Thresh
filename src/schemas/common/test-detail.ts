import { z } from "zod";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

export const ExamDetailCommonSchema = ChuoiDocument.registerSchema(z.object({
	mode: z.literal("EXAM"),
	roomId: z.string(),
	hasPassword: z.boolean(),
	password: z.string().nullable().optional(),
	numberOfAttemptsAllowed: z.number().int().positive(),
	isAnswerVisible: z.boolean(),
	isAllowedToSeeOtherResults: z.boolean(),
	openDate: z.date(),
	closeDate: z.date(),
	participants: z.array(z.string()),
}), "ExamDetailCommonSchema");

export const PracticeDetailCommonSchema = ChuoiDocument.registerSchema(z.object({
	mode: z.literal("PRACTICE"),

	difficulty: z.string(),
	tags: z.array(z.string()),
	numberOfQuestions: z.number().int().positive(),
	numberOfOptions: z.number().int().positive(),
	outlines: z.array(z.string()),
}), "PracticeDetailCommonSchema");

export const TestDetailCommonSchema = ChuoiDocument.registerSchema(z.discriminatedUnion("mode", [
	ExamDetailCommonSchema,
	PracticeDetailCommonSchema,
]), "TestDetailCommonSchema");

export type TestDetailCommon = z.infer<typeof TestDetailCommonSchema>;
export type ExamDetailCommon = z.infer<typeof ExamDetailCommonSchema>;
export type PracticeDetailCommon = z.infer<typeof PracticeDetailCommonSchema>;