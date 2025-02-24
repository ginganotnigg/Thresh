import { ErrorResponseBase, ErrorResponseCodes } from "../base/error-response.base";
import { ValidationError as ClassValidationError } from "class-validator";

export class ValidationError extends ErrorResponseBase {
	constructor(errors?: ClassValidationError[] | any) {
		const message = 'Validation failed';
		let context = undefined;
		if (errors instanceof Array && errors.length > 0 && errors[0] instanceof ClassValidationError) {
			context = errors?.map(error => ({
				property: error.property,
				constraints: error.constraints
			}));
		} else {
			context = errors;
		}
		super(ErrorResponseCodes.VALIDATION_FAILED, message, context);
	}
}