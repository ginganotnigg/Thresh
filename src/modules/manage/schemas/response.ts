import { z } from "zod";

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

export {
	TestResponseSchema,
	TestItemResponseSchema,
	QuestionResponseSchema,
};

export type TestResponse = z.infer<typeof TestResponseSchema>;
export type TestItemResponse = z.infer<typeof TestItemResponseSchema>;
export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;