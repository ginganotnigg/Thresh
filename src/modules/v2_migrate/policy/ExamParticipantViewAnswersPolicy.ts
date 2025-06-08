import { CredentialsMeta } from "../../../shared/controller/schemas/meta";
import { PolicyError } from "../base/policy-error";
import { ExamParticipantPolicy } from "./participant/ExamParticipantPolicy";


export class ExamParticipantViewAnswersPolicy extends ExamParticipantPolicy {
	constructor(
		credentials: CredentialsMeta,
		authorId: string,
		participantIds: string[],
		private readonly isAllowedToViewAnswers: boolean
	) {
		super(credentials, authorId, participantIds);
	}

	verify(): void {
		super.verify();
		if (!this.isAllowedToViewAnswers) {
			throw new PolicyError(`You are not allowed to view the answers of this exam.`);
		}
	}
}
