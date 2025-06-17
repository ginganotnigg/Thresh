import { z } from "zod";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";
import { MCQResourceSchema } from "./mcq/resource.schema";
import { LongAnswerResourceSchema } from "./long-answer/resouce.schema";
import { NonNegativeNumberSchema } from "../../shared/controller/schemas/base";
import { TestBaseSchema } from "../tests/base.schema";
import { AnswerResourceSchema } from "../attempts/uc_query/get-attempt-answers-query/response";
import { QuestionCoreSchema } from "./base.schema";

const QuestionAggregateSchema = z.object({
	numberOfAnswers: NonNegativeNumberSchema,
	numberOfCorrectAnswers: NonNegativeNumberSchema,
	averageScore: NonNegativeNumberSchema,
});

const QuestionIncludeSchema = z.object({
	test: TestBaseSchema,
	answers: AnswerResourceSchema.array()
});

const QuestionViewSchema = z.object({
	viewCorrectAnswers: z.boolean(),
});

const QuestionCoreSchema = QuestionCoreSchema.extend({
	_view: QuestionViewSchema,
	_include: QuestionIncludeSchema.partial(),
	_aggregate: QuestionAggregateSchema.partial(),
});

export const QuestionResourceSchema = ChuoiDocument.registerSchema(QuestionCoreSchema, "QuestionResourceSchema");
export const QuestionsResourceSchema = ChuoiDocument.registerSchema(QuestionCoreSchema.array(), "QuestionsResourceSchema");
