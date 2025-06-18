import { ErrorResponseBase, ErrorResponseCodes } from "../controller/errors/error-response.base";

export class DomainError extends ErrorResponseBase {
	constructor(message: string, context?: any) {
		super(
			400,
			ErrorResponseCodes.DOMAIN,
			message,
			context,
			[]
		);
	}
}