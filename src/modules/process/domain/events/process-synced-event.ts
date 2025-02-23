import { IEventDTO } from "../../../../common/event/event.dto.i";

export class ProcessSyncedEvent implements IEventDTO {
	constructor(
		public readonly attemptId: number,
		public readonly timeLeft: number
	) { }
}