import { CommandHandlerBase } from "./usecase.base";
import { RetryUtil, RetryConfig } from "../utils/retry.util";
import { OptimisticError } from "../errors/optimistic.error";

/**
 * Enhanced command handler base with built-in retry capability for optimistic locking
 */
export abstract class RetryableCommandHandlerBase<TParams = void, TResult = void, TId = string> extends CommandHandlerBase<TParams, TResult, TId> {

	/**
	 * Execute an operation with retry logic for optimistic lock conflicts
	 */
	protected async executeWithRetry<T>(
		operation: () => Promise<T>,
		config?: RetryConfig
	): Promise<T> {
		return RetryUtil.executeWithOptimisticLock(operation, config?.maxRetries);
	}
}
