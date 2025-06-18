import { IDomainEvent } from './IDomainEvent';

export abstract class DomainEvent implements IDomainEvent {
	public readonly occurredOn: Date;
	public abstract readonly eventType: string;

	constructor() {
		this.occurredOn = new Date();
	}
}
