import { z } from "zod";

export const BooleanStringSchema = z.enum(["true", "false"]).transform((value) => value === "true");

// New Schemas
export const QueryBooleanSchema = z.enum(["1", "0"]).optional().default("0");
export const QuerySortOptionsSchema = z.enum(["asc", "desc"]).optional();
export const QueryNumberSchema = z.coerce.number().int().optional().default(0);
