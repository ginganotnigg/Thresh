import { DomainEventBase } from "../../shared/domain";

export class ScoreLongAnswerEvent extends DomainEventBase {
	constructor(
		public readonly answerId: string,
		public readonly score: number,
		public readonly comment?: string,
	) { super(); }
}