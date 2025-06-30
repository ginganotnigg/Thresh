import { DomainEventBase } from "../../shared/domain/DomainEventBase";

export class AttemptSubmittedEvent extends DomainEventBase {
	constructor(
		public readonly attemptId: string,
	) {
		super();
	}
}