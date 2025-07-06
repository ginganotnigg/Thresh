import { DomainEventBase } from "../../shared/domain/DomainEventBase";
import { QuestionLoad } from "../_mappers/QuestionMapper";

export class AttemptSubmittedEvent extends DomainEventBase {
	constructor(
		public readonly attemptId: string,
		public readonly testId: string,
		public readonly questions: QuestionLoad[],
		public readonly testLanguage: string
	) {
		super();
	}
}