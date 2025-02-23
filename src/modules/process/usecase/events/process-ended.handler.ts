import { ProcessEndedEvent } from "../../domain/events/process-ended.event";
import { INotify } from "../../domain/contracts/notify.i";

export class ProcessEnededEventHandler {
	constructor(
		private readonly notificator: INotify
	) { }

	handle(event: ProcessEndedEvent): void {
		this.notificator.sendEvaluated(event.attemptId);
	}
}
