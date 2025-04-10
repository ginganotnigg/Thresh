import { z } from "zod";

export const TestIdBodySchema = z.object({
	testId: z.coerce.number(),
});

export type TestIdBody = z.infer<typeof TestIdBodySchema>;