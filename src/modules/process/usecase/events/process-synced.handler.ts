import { IEventHandler } from "../../../../common/event/event.handler.i";
import { INotify } from "../../domain/contracts/notify.i";
import { ProcessSyncedEvent } from "../../domain/events/process-synced-event";

export class ProcessSyncedHandler implements IEventHandler {
	constructor(
		private readonly notificator: INotify
	) { }

	async handle(event: ProcessSyncedEvent): Promise<void> {
		this.notificator.sendSynced(event.attemptId, event.timeLeft);
	}
}