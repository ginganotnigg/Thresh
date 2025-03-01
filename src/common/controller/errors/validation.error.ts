import { ZodError } from "zod";
import { ErrorResponseBase, ErrorResponseCodes } from "./error-response.base";
import { ValidationError as ClassValidationError } from "class-validator";

export class ValidationError extends ErrorResponseBase {
	constructor(errors: any) {
		const message = 'Validation failed';
		let context = undefined;
		if (errors instanceof Array && errors.length > 0 && errors[0] instanceof ClassValidationError) {
			context = errors?.map(error => ({
				property: error.property,
				constraints: error.constraints
			}));
		}
		else if (errors instanceof ZodError) {
			context = {
				message: errors.message,
				errors: errors.errors.map(error => ({
					message: error.message
				})),
			};
		}
		else {
			context = errors;
		}
		super(400, ErrorResponseCodes.VALIDATION_FAILED, message, context);
	}
}