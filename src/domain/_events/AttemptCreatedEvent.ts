import { DomainEventBase } from "../../shared/domain/DomainEventBase";


export class AttemptCreatedEvent extends DomainEventBase {
	constructor(
		public readonly attemptId: string,
		public readonly endDate: Date,
	) {
		super();
	}
}
