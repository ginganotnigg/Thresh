import { DomainEventBase } from "../../shared/domain";

export class ScoreLongAnswerEvent extends DomainEventBase {
	constructor(
		public readonly attemptId: string,
		public readonly answerId: string,
		public readonly score: number,
	) { super(); }
}