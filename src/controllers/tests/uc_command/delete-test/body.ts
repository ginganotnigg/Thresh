import { z } from "zod";

export const DeleteTestBodySchema = z.object({
	testId: z.string(),
});

export type DeleteTestBody = z.infer<typeof DeleteTestBodySchema>;
