import { z } from "zod";
import { AttemptQueryCoreSchema } from "../../schemas/query.schema";

export const GetAttemptQueryParamSchema = AttemptQueryCoreSchema.extend({
});
export type GetAttemptQueryParam = z.infer<typeof GetAttemptQueryParamSchema>;
