import { CredentialsMeta } from "../../../../shared/controller/schemas/meta";
import { CredentialsPolicyBase } from "../../base/credentials.policy.base";
import { PolicyError } from "../../base/policy-error";

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

