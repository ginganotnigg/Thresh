import { z } from "zod";
import { TestFullSchema } from "../../../../schemas/core/test";

export const FindExamResponseSchema = z.object({
	data: TestFullSchema.nullable(),
	hasJoined: z.boolean().default(false),
});
export type FindExamResponse = z.infer<typeof FindExamResponseSchema>;
