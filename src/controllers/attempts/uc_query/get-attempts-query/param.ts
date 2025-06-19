import { z } from "zod";
import { QueryAttemptsParamSchema } from "../../../../schemas/params/attempts";

export const GetAttemptsQueryParamSchema = QueryAttemptsParamSchema;
export type GetAttemptsQueryParam = z.infer<typeof GetAttemptsQueryParamSchema>;
