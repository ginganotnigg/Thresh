import { RetryConfig } from "../utils/retry.util";

/**
 * Centralized retry configuration for the application
 */
export const retryConfig = {
	/**
	 * Default configuration for optimistic lock retries
	 */
	optimisticLock: {
		maxRetries: 5,
		baseDelayMs: 25,
		maxDelayMs: 500,
		jitter: true
	} as RetryConfig,

	/**
	 * Configuration for database operations with higher contention
	 */
	highContention: {
		maxRetries: 7,
		baseDelayMs: 50,
		maxDelayMs: 1000,
		jitter: true
	} as RetryConfig,

	/**
	 * Configuration for background jobs (more aggressive retries)
	 */
	backgroundJob: {
		maxRetries: 10,
		baseDelayMs: 100,
		maxDelayMs: 2000,
		jitter: true
	} as RetryConfig,

	/**
	 * Configuration for real-time operations (fewer retries, faster response)
	 */
	realTime: {
		maxRetries: 3,
		baseDelayMs: 10,
		maxDelayMs: 200,
		jitter: true
	} as RetryConfig
};
