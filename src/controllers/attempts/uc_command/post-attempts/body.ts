import { z } from "zod";

export const PostAttemptsBodySchema = z.object({
	testId: z.string(),
});

export type PostAttemptsBody = z.infer<typeof PostAttemptsBodySchema>;