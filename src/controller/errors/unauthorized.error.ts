import { ErrorResponseBase, ErrorResponseCodes } from "./error-response.base";

export class UnauthorizedError extends ErrorResponseBase {
	constructor() {
		super(
			401,
			ErrorResponseCodes.UNAUTHORIZED,
			'Unauthorized',
			undefined,
			['https://tools.ietf.org/html/rfc7235#section-3.1']
		)
	}
}