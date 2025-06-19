import { z } from "zod";
import { TestFullSchema } from "../../../../schemas/core/test";

export const GetTestResponse = TestFullSchema;
export type GetTestResponse = z.infer<typeof GetTestResponse>;
