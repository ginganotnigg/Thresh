import { IEventDTO } from "../../../../common/event/event.dto.i";

export class ProcessEndedEvent implements IEventDTO {
	constructor(
		public readonly attemptId: number
	) { }
}