import { z } from "zod";

export const UserIdMeta = z.object({
	userId: z.string(),
});

export const CredentialsMetaSchema = z.object({
	userId: z.coerce.string({ message: "User ID is required" }),
	role: z.coerce.number({ message: "Role ID is required or invalid" }),
});

export type CredentialsMeta = z.infer<typeof CredentialsMetaSchema>;

