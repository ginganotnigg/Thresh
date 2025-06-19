export abstract class DomainEventBase {
	public readonly occurredOn: Date;

	constructor() {
		this.occurredOn = new Date();
	}
}