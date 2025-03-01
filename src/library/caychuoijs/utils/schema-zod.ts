import { z } from "zod";
import { ValidationError } from "../../../common/controller/errors/validation.error";

export function zodParse<TParsed extends Record<string, any>>(schema: z.ZodObject<any, any, any, TParsed, any>, obj: any): TParsed {
	const result = schema.safeParse(obj);
	if (result.success) {
		return result.data;
	}
	throw new ValidationError(result.error.message);
}
