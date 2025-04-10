import { IEventDTO } from "../../library/cayduajs/event/event.dto.i";

export class AttemptStartedEvent implements IEventDTO {
	constructor(
		public readonly attemptId: number,
		public readonly endDate: Date
	) { }
}

export class AttemptEndedEvent implements IEventDTO {
	constructor(
		public readonly attemptId: number
	) { }
}

export class AttemptAnsweredEvent implements IEventDTO {
	constructor(
		public readonly attemptId: number,
		public readonly questionId: number,
		public readonly optionId: number
	) { }
}

export class AttemptTimeSycnedEvent implements IEventDTO {
	constructor(
		public readonly attemptId: number,
		public readonly secondsLeft: number
	) { }
}