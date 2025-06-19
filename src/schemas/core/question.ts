import { z } from "zod";
import { NonNegativeNumberSchema } from "../../shared/controller/schemas/base";
import { QuestionTypesAsConst } from "../../shared/enum";
import { QuestionDetailCommonSchema } from "../common/question-detail";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

export const QuestionCoreSchema = ChuoiDocument.registerSchema(z.object({
	id: z.number(),
	testId: z.string(),
	text: z.string(),
	points: z.number().int().nonnegative(),
	type: z.enum(QuestionTypesAsConst),

	detail: QuestionDetailCommonSchema,

	_aggregate_test: z.object({
		numberOfAnswers: NonNegativeNumberSchema,
		numberOfCorrectAnswers: NonNegativeNumberSchema,
		averageScore: NonNegativeNumberSchema,
	}),
}), "QuestionCoreSchema");

export type QuestionCore = z.infer<typeof QuestionCoreSchema>;