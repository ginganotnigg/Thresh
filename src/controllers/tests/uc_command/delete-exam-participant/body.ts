import { z } from "zod";

export const DeleteExamParticipantBodySchema = z.object({
	participantId: z.string(),
});

export type DeleteExamParticipantBody = z.infer<typeof DeleteExamParticipantBodySchema>;
