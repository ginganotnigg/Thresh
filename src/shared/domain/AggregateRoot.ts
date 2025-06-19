import { Entity } from './Entity';
import { DomainEventBase } from './DomainEventBase';

export abstract class AggregateRoot<TId = string> extends Entity<TId> {
	private _domainEvents: DomainEventBase[] = [];

	constructor(id: TId) {
		super(id);
	}

	protected addDomainEvent(domainEvent: DomainEventBase): void {
		this._domainEvents.push(domainEvent);
	}

	protected removeDomainEvent(domainEvent: DomainEventBase): void {
		const index = this._domainEvents.indexOf(domainEvent);
		if (index > -1) {
			this._domainEvents.splice(index, 1);
		}
	}

	public clearDomainEvents(): void {
		this._domainEvents = [];
	}

	public getDomainEvents(): readonly DomainEventBase[] {
		return [...this._domainEvents];
	}
}

