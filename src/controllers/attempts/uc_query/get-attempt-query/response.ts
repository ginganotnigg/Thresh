import { z } from "zod";
import { ChuoiDocument } from "../../../../library/caychuoijs/documentation/open-api";
import { AttemptCoreSchema } from "../../schemas/resource.schema";

export const GetAttemptQueryResponseSchema = ChuoiDocument.registerSchema(AttemptCoreSchema, "GetAttemptQueryResponseSchema");
export type GetAttemptQueryResponse = z.infer<typeof GetAttemptQueryResponseSchema>;
