import { z } from "zod";
import { QuestionTypeType } from "../../../domain/enum";
import { ChuoiDocument } from "../../../library/caychuoijs/documentation/open-api";
import { NonNegativeNumberSchema } from "../../../shared/controller/schemas/base";

const MCQAnswerSchema = z.object({
	type: z.literal<QuestionTypeType>("MCQ"),
	chosenOption: z.number(),
});

const LongAnswerSchema = z.object({
	type: z.literal<QuestionTypeType>("LONG_ANSWER"),
	answer: z.string(),
});

export const AnswerForQuestionTypeSchema = ChuoiDocument.registerSchema(z.discriminatedUnion("type", [
	MCQAnswerSchema,
	LongAnswerSchema,
]), "AnswerForQuestionTypeSchema");

export const AnswerCoreSchema = ChuoiDocument.registerSchema(z.object({
	id: z.string(),
	attemptId: z.string(),
	questionId: z.number(),
	pointReceived: NonNegativeNumberSchema.default(0),
	createdAt: z.date(),
	updatedAt: z.date(),
	child: AnswerForQuestionTypeSchema,
}), "AnswerCoreSchema");
