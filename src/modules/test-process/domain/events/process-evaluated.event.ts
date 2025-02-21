import { IEventDTO } from "../../../../common/event/event.dto.i";

export class ProcessEvaluatedEvent implements IEventDTO {
	constructor(
		public readonly attemptId: number
	) { }
}