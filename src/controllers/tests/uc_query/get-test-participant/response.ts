import { z } from "zod";
import { TestCandidateCoreSchema } from "../../../../schemas/core/test-candidate";

export const GetTestParticipantResponseSchema = TestCandidateCoreSchema;
export type GetTestParticipantResponse = z.infer<typeof GetTestParticipantResponseSchema>;
