import { AggregateRoot } from "../../shared/domain";
import { EventDispatcher } from "../../shared/domain/EventDispatcher";

export abstract class RepoBase<TAgg extends AggregateRoot<TId>, TId = string> {
	protected abstract _save(agg: TAgg): Promise<void>;

	async save(agg: TAgg): Promise<void> {
		await this._save(agg);
		EventDispatcher.getInstance().dispatchAggregate(agg);
	}
}
