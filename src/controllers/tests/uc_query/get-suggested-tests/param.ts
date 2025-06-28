import { z } from "zod";
import { QueryNumberSchema } from "../../../../shared/controller/schemas/query";

export const GetSuggestedTestsQuerySchema = z.object({
	numberOfTests: QueryNumberSchema.default(5),
});
export type GetSuggestedTestsQuery = z.infer<typeof GetSuggestedTestsQuerySchema>;
