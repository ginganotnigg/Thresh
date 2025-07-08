import { z } from "zod";

export const PatchAttemptScoreBodySchema = z.object({
	evaluations: z.array(z.object({
		answerId: z.string(),
		points: z.number().int().min(0),
		comment: z.string().optional(),
	})),
});

export type PatchAttemptScoreBody = z.infer<typeof PatchAttemptScoreBodySchema>;

