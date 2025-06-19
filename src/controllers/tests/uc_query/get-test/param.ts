import { z } from "zod";
import { QueryBooleanSchema } from "../../../../shared/controller/schemas/base";

export const GetTestQueryParamSchema = z.object({
	viewPassword: QueryBooleanSchema
});

export type GetTestQueryParam = z.infer<typeof GetTestQueryParamSchema>;