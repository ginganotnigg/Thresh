import { z } from "zod";
import { QuerySortOptionsSchema } from "../../shared/controller/schemas/base";

export const FeedbacksQuerySchema = z.object({
	testId: z.string(),
	sortByCreatedAt: QuerySortOptionsSchema,
	sortByRating: QuerySortOptionsSchema,
	filterByProblems: z.array(z.string()).optional(),
});