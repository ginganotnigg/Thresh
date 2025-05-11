import { number, z } from "zod";
import { TestDifficulty } from "../enum";
import { FeedbackProblemsEnum } from "../models/feedback";

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

export const ExamTestCoreSchema = z.object({
	testId: z.string(),
	roomId: z.string(),
	password: z.string().nullable(),
	numberOfAttemptsAllowed: z.number().int().positive(),
	isAnswerVisible: z.boolean(),
	isAllowedToSeeOtherResults: z.boolean(),
	openDate: z.date(),
	closeDate: z.date(),
});

export const AttemptCoreSchema = z.object({
	id: z.string(),
	order: z.number().int().positive(),
	testId: z.string(),
	candidateId: z.string(),
	hasEnded: z.boolean(),
	secondsSpent: z.number().int().nonnegative(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const AnswerCoreSchema = z.object({
	attemptId: z.string(),
	questionId: z.number(),
	chosenOption: z.number(),
});

export const FeedbackCoreSchema = z.object({
	practiceTestId: z.string(),
	rating: z.number().min(1).max(10),
	problems: z.array(z.nativeEnum(FeedbackProblemsEnum)),
	comment: z.string(),
});

export type TestCore = z.infer<typeof TestCoreSchema>;
export type QuestionCore = z.infer<typeof QuestionCoreSchema>;
export type UserCore = z.infer<typeof UserCoreSchema>;
export type PracticeTestCore = z.infer<typeof PracticeTestCoreSchema>;
export type ExamTestCore = z.infer<typeof ExamTestCoreSchema>;
export type AttemptCore = z.infer<typeof AttemptCoreSchema>;
export type AnswerCore = z.infer<typeof AnswerCoreSchema>;
export type FeedbackCore = z.infer<typeof FeedbackCoreSchema>;