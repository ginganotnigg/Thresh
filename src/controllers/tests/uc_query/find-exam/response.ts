import { z } from "zod";
import { TestFullSchema } from "../../../../schemas/core/test";

export const FindTestResponseSchema = z.object({
	data: TestFullSchema.nullable(),
	hasJoined: z.boolean().default(false),
});
export type FindTestResponse = z.infer<typeof FindTestResponseSchema>;
