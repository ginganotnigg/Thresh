import { DomainError } from "../../controllers/shared/errors/domain.error";
import { CredentialsMeta } from "../../controllers/shared/schemas/meta";
import Test from "../../infrastructure/models/test";

export class PracticePolicy {
	constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) { }

	checkAuthor(): void {
		if (this.test.get().authorId !== this.credentials.userId) {
			throw new DomainError(`You are not the author of this test`);
		}
	}
}