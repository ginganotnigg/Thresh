import { z } from "zod";
import { AttemptStatus, TestDifficulty } from "../enum";

export const TestCoreSchema = z.object({
	id: z.string(),
	authorId: z.string(),
	title: z.string(),
	description: z.string(),
	minutesToAnswer: z.number().min(1).max(10000),
	language: z.string(),
	mode: z.string(),
});

export const QuestionCoreSchema = z.object({
	id: z.number(),
	testId: z.string(),
	text: z.string(),
	options: z.array(z.string()),
	points: z.number(),
	correctOption: z.number(),
});

export const UserCoreSchema = z.object({
	id: z.string(),
	name: z.string(),
	avatar: z.string().optional(),
});

export const PracticeTestCoreSchema = z.object({
	id: z.number(),
	testId: z.string(),
	difficulty: z.nativeEnum(TestDifficulty),
	tags: z.array(z.string()),
	numberOfQuestions: z.number().int().positive(),
	numberOfOptions: z.number().int().positive(),
	outlines: z.array(z.string()),
});

export const AttemptCoreSchema = z.object({
	id: z.string(),
	order: z.number().int().positive(),
	testId: z.string(),
	candidateId: z.string(),
	hasEnded: z.boolean(),
	secondsSpent: z.number().int().positive(),
});

export const AnswerCoreSchema = z.object({
	attemptId: z.number(),
	questionId: z.number(),
	chosenOption: z.number(),
});

export type TestCore = z.infer<typeof TestCoreSchema>;
export type QuestionCore = z.infer<typeof QuestionCoreSchema>;
export type UserCore = z.infer<typeof UserCoreSchema>;
export type PracticeTestCore = z.infer<typeof PracticeTestCoreSchema>;
export type AttemptCore = z.infer<typeof AttemptCoreSchema>;
