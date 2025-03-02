import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import { ISchemaValidator } from "../contracts";
import { Constructor } from "./type";
import { ValidationError } from "../../../common/controller/errors/validation.error";
import { ChuoiContainer } from "./container";

export class ClassValidatorSchemaValidator implements ISchemaValidator {
	validate<T extends object>(obj: any, type: Constructor<T>): T {
		const parsedPlain = plainToClass(type, obj);
		const errors = validateSync(parsedPlain);
		if (errors.length > 0) {
			throw new ValidationError(errors);
		}
		return parsedPlain;
	}
}

ChuoiContainer.register(ClassValidatorSchemaValidator);