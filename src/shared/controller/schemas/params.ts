import { z } from "zod";

export const TestIdParamsSchema = z.object({
	testId: z.string(),
});

export const QuestionIdParamsSchema = z.object({
	questionId: z.coerce.number(),
});

export const AttemptIdParamsSchema = z.object({
	attemptId: z.string(),
});

export const CandidateIdParamsSchema = z.object({
	candidateId: z.string(),
});

export const AnswersIdParamsSchema = z.object({
	answersId: z.string(),
});

export const TemplateIdParamsSchema = z.object({
	templateId: z.string(),
});

export const FeedbackIdParamsSchema = z.object({
	feedbackId: z.string(),
});