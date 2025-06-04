import { DomainError } from "../../shared/controller/errors/domain.error";
import { CredentialsMeta } from "../../shared/controller/schemas/meta";
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