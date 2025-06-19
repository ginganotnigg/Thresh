import { z } from "zod";

export const PostExamParticipantBodySchema = z.object({
	testId: z.string(),
	participantId: z.string(),
	password: z.string().nullish(),
});

export type PostExamParticipantBody = z.infer<typeof PostExamParticipantBodySchema>;