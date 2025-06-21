import { z } from "zod";

export const PostExamParticipantBodySchema = z.object({
	password: z.string().nullish(),
});

export type PostExamParticipantBody = z.infer<typeof PostExamParticipantBodySchema>;