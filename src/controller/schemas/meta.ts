import { z } from "zod";

export const UserIdMetaSchema = z.object({
	userId: z.coerce.string().nonempty({ message: "Unauthorized" })
});