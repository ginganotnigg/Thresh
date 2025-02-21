import { ProcessEvaluatedEvent } from "../../domain/events/process-evaluated.event";
import { INotify } from "../../domain/contracts/notify.i";

export class ProcessEvaluatedEventHandler {
	constructor(
		private readonly notificator: INotify
	) { }

	handle(event: ProcessEvaluatedEvent): void {
		this.notificator.sendEvaluated(event.attemptId);
	}
}
