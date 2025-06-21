import { z } from "zod";
import { TestCandidateCoreSchema } from "../../../../schemas/core/test-candidate";
import { PagedSchema } from "../../../../shared/controller/schemas/base";

export const GetTestParticipantsResponseSchema = PagedSchema(TestCandidateCoreSchema);
export type GetTestParticipantsResponse = z.infer<typeof GetTestParticipantsResponseSchema>;
