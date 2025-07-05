export class OptimisticError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "OptimisticError";
		this.message = message;
		Error.captureStackTrace(this, OptimisticError);
	}

	static isOptimisticError(error: any): boolean {
		return error instanceof OptimisticError || (error && error.name === "OptimisticError");
	}
}


export class OptimisticRetryError extends Error {
	private readonly attemptCount: number;
	private readonly totalDelayMs: number;

	constructor(attemptCount: number = 0, totalDelayMs: number = 0, message: string = "Optimistic retry error occurred") {
		super(message);
		this.name = "OptimisticRetryError";
		this.message = message;
		this.attemptCount = attemptCount;
		this.totalDelayMs = totalDelayMs;
		Error.captureStackTrace(this, OptimisticRetryError);
	}
}