import { z } from "zod";
import { NonNegativeNumberSchema, PagingSchema } from "../../../../shared/controller/schemas/base";

export const GetSuggestedTestsQuerySchema = z.object({
	numberOfTests: NonNegativeNumberSchema.optional().default(5),
});
export type GetSuggestedTestsQuery = z.infer<typeof GetSuggestedTestsQuerySchema>;
