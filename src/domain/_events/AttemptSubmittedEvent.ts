import { DomainEventBase } from "../../shared/domain/DomainEventBase";

export class AttemptEndedEvent extends DomainEventBase {
	constructor(
		public readonly attemptId: string,
	) {
		super();
	}
}