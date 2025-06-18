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

export type TestIdParamsSchemaType = z.infer<typeof TestIdParamsSchema>;
export type QuestionIdParamsSchemaType = z.infer<typeof QuestionIdParamsSchema>;
export type CandidateIdParamsSchemaType = z.infer<typeof CandidateIdParamsSchema>;
export type AttemptIdParamsSchemaType = z.infer<typeof AttemptIdParamsSchema>;
export type AnswersIdParamsSchemaType = z.infer<typeof AnswersIdParamsSchema>;
export type TemplateIdParamsSchemaType = z.infer<typeof TemplateIdParamsSchema>;
export type FeedbackIdParamsSchemaType = z.infer<typeof FeedbackIdParamsSchema>;
