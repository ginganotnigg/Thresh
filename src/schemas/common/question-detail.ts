import { z } from "zod";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

export const MCQDetailCommonSchema = ChuoiDocument.registerSchema(z.object({
	type: z.literal("MCQ"),
	options: z.string().array().min(2).max(10),
	correctOption: z.number().int().nonnegative().nullable(),
}), "MCQDetailCommonSchema");

export const LongAnswerDetailCommonSchema = ChuoiDocument.registerSchema(z.object({
	type: z.literal("LONG_ANSWER"),
	imageLinks: z.array(z.string()).nullable().optional(),
	extraText: z.string().nullable().optional(),
	correctAnswer: z.string().nullable(),
}), "LongAnswerDetailCommonSchema");

export const QuestionDetailCommonSchema = ChuoiDocument.registerSchema(z.discriminatedUnion("type", [
	MCQDetailCommonSchema,
	LongAnswerDetailCommonSchema,
]), "QuestionDetailCommonSchema");

export type QuestionDetailCommon = z.infer<typeof QuestionDetailCommonSchema>;
export type MCQDetailCommon = z.infer<typeof MCQDetailCommonSchema>;
export type LongAnswerDetailCommon = z.infer<typeof LongAnswerDetailCommonSchema>;
