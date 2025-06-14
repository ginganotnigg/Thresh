import { z } from "zod";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

export const PostCandidateBodySchema = ChuoiDocument.registerSchema(z.object({
	testId: z.string(),
	password: z.string().optional(),
}), "PostCandidateBodySchema");