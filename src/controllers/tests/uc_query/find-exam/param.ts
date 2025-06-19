import { z } from "zod";

export const FindExamParamSchema = z.object({
	roomId: z.string().min(1, "Room ID is required"),
});

export type FindExamParam = z.infer<typeof FindExamParamSchema>;