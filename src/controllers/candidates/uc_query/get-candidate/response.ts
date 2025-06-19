import { z } from "zod";
import { CandidateCoreSchema } from "../../../../schemas/candidate/resource"

export const GetCandidateQuerySchema = CandidateCoreSchema;
export type GetCandidateQuery = z.infer<typeof GetCandidateQuerySchema>;