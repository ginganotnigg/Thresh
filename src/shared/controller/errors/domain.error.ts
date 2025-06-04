import { ErrorResponseBase, ErrorResponseCodes } from "./error-response.base";

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