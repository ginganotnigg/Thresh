import { DomainError } from "../../controller/errors/domain.error";
import { CredentialsMeta } from "../../controller/schemas/meta";
import Test from "../../domain/models/test";
import { TestInfo } from "../../domain/schema/info.schema";

export class TestRead {
	private checkSelf() {
		if (this.test.authorId !== this.credentials.userId) {
			throw new DomainError("You are not the author of this test");
		}
	}

	private constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) { }

	static async load(testId: string, credentials: CredentialsMeta): Promise<TestRead> {
		const test = await Test.findByPk(testId);
		if (!test) {
			throw new DomainError("Test not found");
		}
		return new TestRead(test, credentials);
	}

	getTest(): TestInfo {
		this.checkSelf();
		return this.test;
	}
}