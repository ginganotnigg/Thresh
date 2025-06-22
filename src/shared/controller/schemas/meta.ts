import { z } from "zod";
import { RoleNamesAsConst, Roles } from "../../types/credentials";

export const CredentialsMetaSchema = z.object({
	userId: z.coerce.string().optional(),
	role: z.coerce.string().transform((val) => {
		const enumRole = val as Roles;
		if (val == null || enumRole == null) {
			return undefined;
		}
		return RoleNamesAsConst[enumRole];
	}).optional(),
});

export type CredentialsMeta = z.infer<typeof CredentialsMetaSchema>;

