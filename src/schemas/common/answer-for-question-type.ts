import { z } from "zod";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

const MCQAnswerSchema = z.object({
	type: z.literal("MCQ"),
	chosenOption: z.number(),
});

const LongAnswerSchema = z.object({
	type: z.literal("LONG_ANSWER"),
	answer: z.string(),
});

export const AnswerForQuestionCommonSchema = ChuoiDocument.registerSchema(z.discriminatedUnion("type", [
	MCQAnswerSchema,
	LongAnswerSchema,
]), "AnswerForQuestionTypeSchema");

export type AnswerForQuestionCommon = z.infer<typeof AnswerForQuestionCommonSchema>;

