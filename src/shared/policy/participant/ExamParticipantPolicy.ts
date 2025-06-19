import { CredentialsPolicyBase } from "../../handler/policy.base";
import { PolicyError } from "../../errors/policy.error";
import { CredentialsMeta } from "../../schemas/meta";

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
