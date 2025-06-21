import { z } from "zod";
import { TestCoreSchema } from "../../../../schemas/core/test";
import { ExamDetailCommonSchema, PracticeDetailCommonSchema } from "../../../../schemas/common/test-detail";
import { QuestionCoreSchema } from "../../../../schemas/core/question";
import { LongAnswerDetailCommonSchema, MCQDetailCommonSchema } from "../../../../schemas/common/question-detail";

export const PutTestBodySchema = TestCoreSchema.omit({
	id: true,
	authorId: true,
	createdAt: true,
	updatedAt: true
}).extend({
	detail: z.discriminatedUnion("mode", [
		ExamDetailCommonSchema.omit({
			participants: true,
			hasPassword: true,
		}),
		PracticeDetailCommonSchema,
	]),
	questions: z.array(
		QuestionCoreSchema.omit({
			id: true,
			testId: true,
			_aggregate_test: true,
			detail: true,
		}).extend({
			detail: z.discriminatedUnion("type", [
				MCQDetailCommonSchema.extend({
					correctOption: z.number().int().nonnegative(),
				}),
				LongAnswerDetailCommonSchema.extend({
					correctAnswer: z.string(),
				}),
			])
		}),
	),
});

export type PutTestBody = z.infer<typeof PutTestBodySchema>;
