import { z } from "zod";
import { ValidationError } from "../../../common/controller/errors/validation.error";

export function zodParse<TParsed>(schema: z.ZodObject<any, any, any, TParsed, any> | z.ZodType<TParsed>, obj: any): TParsed {
	const result = schema.safeParse(obj);
	if (result.success) {
		return result.data;
	}
	throw new ValidationError(result.error);
}
