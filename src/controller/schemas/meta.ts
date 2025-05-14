import { z } from "zod";

export const UserIdMeta = z.object({
	userId: z.string(),
});

export const CredentialsMetaSchema = z.object({
	userId: z.coerce.string(),
	role: z.coerce.number(),
});

export type CredentialsMeta = z.infer<typeof CredentialsMetaSchema>;

