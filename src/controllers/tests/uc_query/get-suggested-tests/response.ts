import { z } from "zod";
import { TestFullSchema } from "../../../../schemas/core/test";
import { PagedSchema } from "../../../../shared/controller/schemas/base";

export const GetSuggestedTestsResponseSchema = z.array(TestFullSchema);
export type GetSuggestedTestsResponse = z.infer<typeof GetSuggestedTestsResponseSchema>;
