import { z } from "zod";
import { PagedSchema } from "../../../../shared/controller/schemas/base";
import { ChuoiDocument } from "../../../../library/caychuoijs/documentation/open-api";
import { AttemptCoreSchema } from "../../schemas/resource.schema";

export const GetAttemptsResourceResponseSchema = ChuoiDocument.registerSchema(PagedSchema(
	AttemptCoreSchema
), "GetAttemptsResourceResponseSchema");

export type GetAttemptsResourceResponse = z.infer<typeof GetAttemptsResourceResponseSchema>;

