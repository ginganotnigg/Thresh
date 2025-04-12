import { z } from "zod";

export const UserIdMeta = z.object({
	userId: z.string(),
});