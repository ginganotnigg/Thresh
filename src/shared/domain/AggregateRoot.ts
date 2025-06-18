import { Entity } from './Entity';
import { IDomainEvent } from './IDomainEvent';

export abstract class AggregateRoot<TId = string> extends Entity<TId> {
	private _domainEvents: IDomainEvent[] = [];

	constructor(id: TId) {
		super(id);
	}

	get domainEvents(): readonly IDomainEvent[] {
		return [...this._domainEvents];
	}

	protected addDomainEvent(domainEvent: IDomainEvent): void {
		this._domainEvents.push(domainEvent);
	}

	public clearDomainEvents(): void {
		this._domainEvents = [];
	}

	protected removeDomainEvent(domainEvent: IDomainEvent): void {
		const index = this._domainEvents.indexOf(domainEvent);
		if (index > -1) {
			this._domainEvents.splice(index, 1);
		}
	}
}
