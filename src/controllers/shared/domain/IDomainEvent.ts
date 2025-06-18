export interface IDomainEvent {
	readonly occurredOn: Date;
	readonly eventType: string;
}
