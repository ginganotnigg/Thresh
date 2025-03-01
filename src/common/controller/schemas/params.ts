import { z } from "zod";

export const TestIdParamsSchema = z.object({
	testId: z.coerce.number(),
});

export const AttemptIdParamsSchema = z.object({
	attemptId: z.coerce.number(),
});

export const TagIdParamsSchema = z.object({
	tagId: z.coerce.number(),
});