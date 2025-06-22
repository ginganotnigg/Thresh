import { DomainEventBase } from "../../shared/domain/DomainEventBase";
import { CredentialsBase } from "../../shared/types/credentials";

export class AttemptEndedEvent extends DomainEventBase {
	constructor(
		public readonly attemptId: string,
	) {
		super();
	}
}