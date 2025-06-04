import { DomainError } from "../../../../shared/controller/errors/domain.error";
import { CredentialsMeta } from "../../../../shared/controller/schemas/meta";
import PracticeTest from "../../../../domain/models/practice_test";
import Test from "../../../../domain/models/test";
import { AttemptRepo } from "../../../../domain/repo/attempt/attempt.repo";

export class AttemptsOfPracticeWrite {
	private constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) { }

	static async load(
		testId: string,
		credentials: CredentialsMeta,
	): Promise<AttemptsOfPracticeWrite> {
		const test = await Test.findByPk(testId, {
			include: [{
				model: PracticeTest,
				required: true,
			}]
		});
		if (!test) {
			throw new DomainError(`Test not found`);
		}
		if (test.authorId !== credentials.userId) {
			throw new DomainError(`You are not the author of this test`);
		}
		return new AttemptsOfPracticeWrite(test, credentials);
	}

	async start() {
		await AttemptRepo.start({
			testId: this.test.id,
			candidatesId: this.credentials.userId,
		});
	}
}