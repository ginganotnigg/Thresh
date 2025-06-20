import { z } from "zod";
import { QueryAttemptsParamSchema } from "../../../../schemas/params/attempts";

export const GetTestAttemptsQuerySchema = QueryAttemptsParamSchema.omit({
	testId: true,
});

export type GetTestAttemptsQuery = z.infer<typeof GetTestAttemptsQuerySchema>;