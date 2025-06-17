import { z } from "zod";
import { ChuoiDocument } from "../../../../library/caychuoijs/documentation/open-api";

export const PostAttemptsBodySchema = ChuoiDocument.registerSchema(z.object({
	testId: z.string(),
}), "PostAttemptsBodySchema");

export type PostAttemptsBody = z.infer<typeof PostAttemptsBodySchema>;