import { z } from "zod";
import { AttemptStatus } from "../../../common/domain/enum";

const TestResponseSchema = z.object({
	id: z.number(),
	managerId: z.string(),
	title: z.string(),
	description: z.string(),
	difficulty: z.string(),
	minutesToAnswer: z.number(),
	answerCount: z.number(),
	tags: z.array(z.string()),
	createdAt: z.date(),
	updatedAt: z.date(),
});

const TestItemResponseSchema = TestResponseSchema.omit({ description: true }).extend({
	answerCount: z.number(),
});

const QuestionResponseSchema = z.object({
	id: z.number(),
	text: z.string(),
	options: z.array(z.string()),
	points: z.number(),
	correctOption: z.number(),
});

const AttemptResponseSchema = z.object({
	id: z.number(),
	testId: z.number(),
	candidateId: z.string(),
	score: z.number(),
	status: z.nativeEnum(AttemptStatus),
	answerQuestions: z.array(QuestionResponseSchema.extend({ chosenOption: z.number() })),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export {
	TestResponseSchema,
	TestItemResponseSchema,
	QuestionResponseSchema,
	AttemptResponseSchema,
};

export type TestResponse = z.infer<typeof TestResponseSchema>;
export type TestItemResponse = z.infer<typeof TestItemResponseSchema>;
export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
export type AttemptResponse = z.infer<typeof AttemptResponseSchema>;