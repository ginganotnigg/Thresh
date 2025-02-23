import { ErrorResponseBase, ErrorResponseCodes } from "../base/error-response.base";
import { ValidationError as ClassValidationError } from "class-validator";

export class ValidationError extends ErrorResponseBase {
	constructor(errors: ClassValidationError[]) {
		const message = 'Validation failed';
		const context = errors.map(error => ({
			property: error.property,
			constraints: error.constraints
		}));
		super(ErrorResponseCodes.VALIDATION_FAILED, message, context);
	}
}