import { z } from "zod";

export const XRoleIdSchema = z.object({
	"x-role-id": z.string().openapi({ description: "The role ID of the user", example: "1" }),
});

export const XUserIdSchema = z.object({
	"x-user-id": z.string().openapi({ description: "The user ID", example: "1" }),
});

export type XRoleId = z.infer<typeof XRoleIdSchema>;
export type XUserId = z.infer<typeof XUserIdSchema>;