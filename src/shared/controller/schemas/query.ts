import { z } from "zod";

export const BooleanStringSchema = z.enum(["true", "false"]).transform((value) => value === "true");