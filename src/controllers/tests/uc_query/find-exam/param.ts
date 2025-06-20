import { z } from "zod";

export const FindTestQuerySchema = z.object({
	roomId: z.string().min(1, "Room ID is required"),
});

export type FindTestQuery = z.infer<typeof FindTestQuerySchema>;