import { OptimisticError, OptimisticRetryError } from "../errors/optimistic.error";

export interface RetryConfig {
	maxRetries?: number;
	baseDelayMs?: number;
	maxDelayMs?: number;
	jitter?: boolean;
}

export interface RetryResult<T> {
	result: T;
	attemptCount: number;
	totalDelayMs: number;
}

/**
 * Utility class for implementing retry logic with exponential backoff
 */
export class RetryUtil {
	private static readonly DEFAULT_CONFIG: Required<RetryConfig> = {
		maxRetries: 3,
		baseDelayMs: 1000,
		maxDelayMs: 5000,
		jitter: true,
	};

	/**
	 * Execute a function with retry logic
	 */
	static async execute<T>(
		operation: () => Promise<T>,
		config: RetryConfig = {}
	): Promise<RetryResult<T>> {
		const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
		let attemptCount = 0;
		let totalDelayMs = 0;
		const startTime = Date.now();

		while (attemptCount <= finalConfig.maxRetries) {
			try {
				console.log(`[Retry Attempt #${attemptCount + 1}] Executing operation...`);
				const result = await operation();
				return {
					result,
					attemptCount: attemptCount + 1,
					totalDelayMs: Date.now() - startTime
				};
			} catch (error) {
				console.error(`[Retry Attempt #${attemptCount + 1}] Operation failed:`, (error as Error).name);
				attemptCount++;

				// Check if error is retryable
				const isRetryable = error instanceof OptimisticError && error.name === "OptimisticError";

				if (!isRetryable || attemptCount > finalConfig.maxRetries) {
					// If not retryable or max retries exceeded, throw enhanced error
					throw new OptimisticRetryError(attemptCount, totalDelayMs, error instanceof Error ? error.message : "Unknown error");
				}

				// Calculate delay with exponential backoff and optional jitter
				const delay = this.calculateDelay(
					attemptCount,
					finalConfig.baseDelayMs,
					finalConfig.maxDelayMs,
					finalConfig.jitter
				);

				totalDelayMs += delay;
				await this.sleep(delay);
			}
		}

		// This should never be reached due to the logic above, but TypeScript requires it
		throw new Error("Unexpected retry loop exit");
	}

	/**
	 * Execute with optimistic lock retry (convenience method for your use case)
	 */
	static async executeWithOptimisticLock<T>(
		operation: () => Promise<T>,
		maxRetries: number = 3
	): Promise<T> {
		const result = await this.execute(operation, {
			maxRetries,
			baseDelayMs: 50,
			maxDelayMs: 1000,
			jitter: true,
		});
		return result.result;
	}


	private static calculateDelay(
		attemptCount: number,
		baseDelayMs: number,
		maxDelayMs: number,
		jitter: boolean
	): number {
		// Exponential backoff: baseDelay * 2^(attemptCount - 1)
		let delay = baseDelayMs * Math.pow(2, attemptCount - 1);

		// Cap at maximum delay
		delay = Math.min(delay, maxDelayMs);

		// Add jitter to prevent thundering herd
		if (jitter) {
			// Add random jitter of ±25%
			const jitterRange = delay * 0.25;
			const jitterOffset = (Math.random() - 0.5) * 2 * jitterRange;
			delay += jitterOffset;
		}

		return Math.max(0, Math.round(delay));
	}

	private static sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}
