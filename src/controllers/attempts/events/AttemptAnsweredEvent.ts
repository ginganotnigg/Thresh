import { AnswerForQuestionCommon } from "../../../schemas/common/answer-for-question-type";
import { DomainEventBase } from "../../../shared/domain/DomainEventBase";
import { CredentialsBase } from "../../../shared/types/credentials";

export class AttemptAnsweredEvent extends DomainEventBase {
	constructor(
		public readonly attemptId: string,
		public readonly questionId: number,
		public readonly answer: AnswerForQuestionCommon | undefined,
		public readonly credentials: CredentialsBase,
	) {
		super();
	}
}
