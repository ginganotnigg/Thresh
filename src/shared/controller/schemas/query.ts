import { z } from "zod";

export const BooleanStringSchema = z.enum(["true", "false"]).transform((value) => value === "true");

// New Schemas
export const QueryBooleanSchema = z.enum(["1", "0"]).optional().default("0");
export const QuerySortOptionsSchema = z.enum(["asc", "desc"]).optional();
export const QueryNumberSchema = z.coerce.number().int().optional().default(0);
export const QueryArraySchema = <T>(schema: z.ZodType<T>) => z.union([
	z.array(schema),
	z.string().transform((value) => value.split(",").map(item => item.trim() as T))
]).optional();
