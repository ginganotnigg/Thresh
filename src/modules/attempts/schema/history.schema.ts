import { z } from "zod";
import { AttemptInfoSchema } from "../../../shared/resource/attempt.schema";
import { TestInfoSchema } from "../../../shared/resource/test.schema";
import { PagingSchema, SortParamSchema } from "../../../shared/controller/schemas/base";

export const AttemptsOfCandidateQuerySchema = PagingSchema.extend({
	sort: SortParamSchema(["createdAt", "score"]),
	testId: z.string().optional(),
});

export const AttemptWithTestSchema = AttemptInfoSchema.extend({
	test: TestInfoSchema,
});

export type AttemptWithTest = z.infer<typeof AttemptWithTestSchema>;
export type AttemptsOfCandidateQuery = z.infer<typeof AttemptsOfCandidateQuerySchema>;
