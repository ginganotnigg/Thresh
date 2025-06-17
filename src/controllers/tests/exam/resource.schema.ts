import { z } from "zod";

export const ExamResourceSchema = z.object({
	mode: z.literal("EXAM"),

	roomId: z.string(),
	hasPassword: z.boolean(),
	password: z.string().nullable().optional(),
	numberOfAttemptsAllowed: z.number().int().positive(),
	isAnswerVisible: z.boolean(),
	isAllowedToSeeOtherResults: z.boolean(),
	openDate: z.string().datetime(),
	closeDate: z.string().datetime(),
});

export type ExamResourceSchemaType = z.infer<typeof ExamResourceSchema>;