import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ValidationError } from "../errors/validation.error";

export async function validateHelper<T extends object>(obj: any, type: new (...args: any[]) => T): Promise<T> {
	const parsedPlain = plainToClass(type, obj);
	const errors = await validate(parsedPlain);
	if (errors.length > 0) {
		throw new ValidationError(errors);
	}
	return parsedPlain;
}