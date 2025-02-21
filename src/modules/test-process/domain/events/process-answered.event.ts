import { IEventDTO } from "../../../../common/event/event.dto.i";

export class ProcessAnsweredEvent implements IEventDTO {
	constructor(
		public readonly attemptId: number,
		public readonly questionId: number,
		public readonly optionId?: number
	) { }
}