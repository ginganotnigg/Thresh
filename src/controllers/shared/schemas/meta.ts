import { z } from "zod";
import { RoleNamesAsConst } from "../policy/types";

export const CredentialsMetaSchema = z.object({
	userId: z.coerce.string().optional(),
	role: z.enum(["1", "2"]).optional().transform((val) => {
		if (val === undefined) {
			return undefined;
		}
		return RoleNamesAsConst[val];
	}).optional(),
});

export type CredentialsMeta = z.infer<typeof CredentialsMetaSchema>;

