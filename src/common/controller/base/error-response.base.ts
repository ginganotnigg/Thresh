export enum ErrorResponseCodes {
	VALIDATION_FAILED = 1,
}

export abstract class ErrorResponseBase {
	public readonly code: number;
	public readonly message: string;
	public readonly context: any;
	public readonly links: string[];
	public readonly timestamp: Date;

	protected constructor(code: ErrorResponseCodes, message: string, context: any, links?: string[]) {
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