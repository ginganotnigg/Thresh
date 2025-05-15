import { z } from "zod";
import { AttemptInfoSchema, TestInfoSchema } from "../../../domain/schema/info.schema";
import { PagingSchema, SortParamSchema } from "../../../controller/schemas/base";

export const AttemptsOfCandidateQuerySchema = PagingSchema.extend({
	sort: SortParamSchema(["createdAt", "score"]),
	testId: z.string().optional(),
});

export const AttemptWithTestSchema = AttemptInfoSchema.extend({
	test: TestInfoSchema,
});

export type AttemptWithTest = z.infer<typeof AttemptWithTestSchema>;
export type AttemptsOfCandidateQuery = z.infer<typeof AttemptsOfCandidateQuerySchema>;
