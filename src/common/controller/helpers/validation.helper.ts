import { plainToClass } from "class-transformer";
import { isNumber, validate, ValidationError as VE } from "class-validator";
import { ValidationError } from "../errors/validation.error";

export async function validateHelperObject<T extends object>(obj: any, type: new (...args: any[]) => T): Promise<T> {
	const parsedPlain = plainToClass(type, obj);
	const errors = await validate(parsedPlain);
	if (errors.length > 0) {
		throw new ValidationError(errors);
	}
	return parsedPlain;
}

export function validateHelperNumber(obj: any): number {
	const parsed = Number(obj);
	if (!isNumber(parsed)) {
		throw new ValidationError("Not a number");
	}
	return parsed;
}