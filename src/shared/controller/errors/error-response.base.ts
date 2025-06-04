export enum ErrorResponseCodes {
	INTERNAL_SERVER_ERROR = 0,
	VALIDATION_FAILED = 1,
	UNAUTHORIZED = 2,
	FORBIDDEN = 3,
	DOMAIN = 4,
}

export abstract class ErrorResponseBase extends Error {
	public readonly httpCode: number;
	public readonly code: number;
	public readonly message: string;
	public readonly context: any;
	public readonly links: string[];
	public readonly timestamp: Date;

	protected constructor(httpCode: number, code: ErrorResponseCodes, message: string, context: any, links?: string[]) {
		super();
		this.httpCode = httpCode;
		this.code = code;
		this.message = message;
		this.context = context;
		this.links = links || [];
		this.timestamp = new Date();
	}

	public equals(other: ErrorResponseBase): boolean {
		return this.code === other.code;
	}
}