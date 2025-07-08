import { z } from "zod";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";
import { AnswerForQuestionCommonSchema } from "../common/answer-for-question-type";

export const AnswerCoreSchema = ChuoiDocument.registerSchema(z.object({
	id: z.string(),
	attemptId: z.string(),
	questionId: z.number(),
	pointReceived: z.number().nullish(),
	comment: z.string().nullish(),
	createdAt: z.date(),
	updatedAt: z.date(),
	child: AnswerForQuestionCommonSchema,
}), "AnswerCoreSchema");

export type AnswerCore = z.infer<typeof AnswerCoreSchema>;

