import { z } from "zod";

export const DeleteExamParticipantBodySchema = z.object({
	testId: z.string(),
	participantId: z.string(),
});

export type DeleteExamParticipantBody = z.infer<typeof DeleteExamParticipantBodySchema>;
