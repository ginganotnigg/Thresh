import { CredentialsMeta } from "../../schemas/meta";
import { PolicyError } from "../../errors/policy.error";
import { CredentialsPolicyBase } from "../../handler/policy.base";

export class PracticeParticipantPolicy extends CredentialsPolicyBase {
	constructor(
		credentials: CredentialsMeta,
		private readonly authorId: string,
	) {
		super(credentials);
	}

	verify(): void {
		if (this.credentials.userId !== this.authorId) {
			throw new PolicyError(`You are not the author of the practice.`);
		}
	}
}

