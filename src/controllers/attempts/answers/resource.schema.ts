import { z } from "zod";
import { QuestionTypeType } from "../../../domain/enum";
import { ChuoiDocument } from "../../../library/caychuoijs/documentation/open-api";

const MCQAnswerSchema = z.object({
	type: z.literal<QuestionTypeType>("MCQ"),
	chosenOption: z.number(),
});

const LongAnswerSchema = z.object({
	type: z.literal<QuestionTypeType>("LONG_ANSWER"),
	answer: z.string(),
});

export const AnswerResourceSchema = ChuoiDocument.registerSchema(z.object({
	id: z.string(),
	attemptId: z.string(),
	questionId: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),

	child: z.discriminatedUnion("type", [
		MCQAnswerSchema,
		LongAnswerSchema,
	]),
}), "AnswerResourceSchema");

export const PostAnswerResourceSchema = ChuoiDocument.registerSchema(AnswerResourceSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}), "PostAnswerResourceSchema");