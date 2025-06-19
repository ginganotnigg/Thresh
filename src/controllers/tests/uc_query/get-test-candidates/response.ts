import { z } from "zod";
import { TestCandidateCoreSchema } from "../../../../schemas/core/test-candidate";
import { PagedSchema } from "../../../../shared/controller/schemas/base";

export const GetTestCandidatesResponseSchema = PagedSchema(TestCandidateCoreSchema);
export type GetTestCandidatesResponse = z.infer<typeof GetTestCandidatesResponseSchema>;
