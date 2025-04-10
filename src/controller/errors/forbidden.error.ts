import { ErrorResponseBase, ErrorResponseCodes } from "./error-response.base";

export class ForbidenErrorResponse extends ErrorResponseBase {
	constructor() {
		super(
			403,
			ErrorResponseCodes.FORBIDDEN,
			'Forbidden',
			undefined,
			['https://tools.ietf.org/html/rfc7231#section-6.5.3']
		)
	}
}