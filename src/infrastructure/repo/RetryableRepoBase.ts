import { AggregateRoot } from "../../shared/domain";
import { EventDispatcher } from "../../shared/domain/EventDispatcher";
import { RetryUtil } from "../../shared/utils/retry.util";

export abstract class RetryableRepoBase<TAgg extends AggregateRoot<TId>, TId = string> {
	protected abstract _save(agg: TAgg): Promise<void>;

	/**
	 * Save aggregate with built-in optimistic lock retry
	 */
	async save(agg: TAgg): Promise<void> {
		await RetryUtil.executeWithOptimisticLock(async () => {
			await this._save(agg);
			EventDispatcher.getInstance().dispatchAggregate(agg);
		});
	}

	/**
	 * Save aggregate with custom retry configuration
	 */
	async saveWithRetry(agg: TAgg, maxRetries: number): Promise<void> {
		await RetryUtil.executeWithOptimisticLock(async () => {
			await this._save(agg);
			EventDispatcher.getInstance().dispatchAggregate(agg);
		}, maxRetries);
	}
}
