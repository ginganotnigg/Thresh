import { z } from "zod";
import { TestFullSchema } from "../../../../schemas/core/test";
import { PagedSchema } from "../../../../shared/controller/schemas/base";

export const GetTestsResponseSchema = PagedSchema(TestFullSchema);
export type GetTestsResponse = z.infer<typeof GetTestsResponseSchema>;
