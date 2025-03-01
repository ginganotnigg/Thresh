import { z } from "zod";

export const AttemptFilterQuerySchema = z.object({
	sortByStartDate: z.enum(["asc", "desc"]).optional(),
	sortByScore: z.enum(["asc", "desc"]).optional(),
	page: z.number().min(1),
	perPage: z.number().min(1).optional().default(5),
});

export const AttemptAnswerFilterQuerySchema = z.object({
	page: z.number().min(1),
	perPage: z.number().min(1).optional().default(10),
});

export type AttemptFilterQuery = z.infer<typeof AttemptFilterQuerySchema>;
export type AttemptAnswerFilterQuery = z.infer<typeof AttemptAnswerFilterQuerySchema>;

