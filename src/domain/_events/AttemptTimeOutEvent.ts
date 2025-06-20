import { DomainEventBase } from "../../shared/domain/DomainEventBase";


export class AttemptTimeOutEvent extends DomainEventBase {
	constructor(
		public readonly attemptId: string
	) { super(); }
}
