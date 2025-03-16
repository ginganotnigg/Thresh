import { z } from "zod";

export const XRoleIdSchema = z.object({
	"x-role-id": z.coerce.string().openapi({ description: "The role ID of the user", example: "1" }),
})

export type XRoleId = z.infer<typeof XRoleIdSchema>;