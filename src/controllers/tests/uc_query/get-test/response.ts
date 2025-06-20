import { z } from "zod";
import { TestFullSchema } from "../../../../schemas/core/test";

export const GetTestResponseSchema = TestFullSchema;
export type GetTestResponse = z.infer<typeof GetTestResponseSchema>;
