import { DomainError } from "../../../../controllers/shared/errors/domain.error";
import { CredentialsMeta } from "../../../../controllers/shared/schemas/meta";
import PracticeTest from "../../../../infrastructure/models/practice_test";
import Test from "../../../../infrastructure/models/test";
import { AttemptRepo } from "../../../../infrastructure/write/attempt.repo";

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