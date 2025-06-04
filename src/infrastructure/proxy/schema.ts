import { z } from "zod";

export const UserCoreSchema = z.object({
	id: z.string(),
	name: z.string(),
	avatar: z.string().optional(),
});

export type UserCore = z.infer<typeof UserCoreSchema>;
