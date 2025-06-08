import { CredentialsMeta } from "../../../../shared/controller/schemas/meta";
import { CredentialsPolicyBase } from "../../base/credentials.policy.base";
import { PolicyError } from "../../base/policy-error";

export class ExamParticipantPolicy extends CredentialsPolicyBase {
	constructor(
		credentials: CredentialsMeta,
		private readonly authorId: string,
		private readonly participantIds: string[],
	) {
		super(credentials);
	}

	verify(): void {
		if (
			this.credentials.userId !== this.authorId &&
			this.participantIds.includes(this.credentials.userId) === false
		) {
			throw new PolicyError(`You are not part of this exam.`);
		}
	}
}
