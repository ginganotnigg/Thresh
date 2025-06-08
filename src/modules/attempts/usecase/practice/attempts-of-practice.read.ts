import Test from "../../../../infrastructure/models/test";
import { AttemptInfo } from "../../../../shared/resource/attempt.schema";
import { Paged } from "../../../../shared/controller/schemas/base";
import { CredentialsMeta } from "../../../../shared/controller/schemas/meta";
import { DomainError } from "../../../../shared/controller/errors/domain.error";
import { TestAttemptsQueryRepo } from "../../../../infrastructure/read/test-attemps.query-repo";
import { AttemptsOfTestAggregate, AttemptsOfTestQuery } from "../../schema/of-test.schema";
import { AttemptsQueryRepo } from "../../../../infrastructure/read/attempts.query-repo";
import PracticeTest from "../../../../infrastructure/models/practice_test";

export class AttemptsOfPracticeRead {
	private readonly attemptsQueryRepo: AttemptsQueryRepo;
	private readonly testAttemptsQueryRepo: TestAttemptsQueryRepo;

	private constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) {
		this.attemptsQueryRepo = new AttemptsQueryRepo();
		this.testAttemptsQueryRepo = new TestAttemptsQueryRepo(this.test);
	}

	static async create(testId: string, credentials: CredentialsMeta): Promise<AttemptsOfPracticeRead> {
		const test = await Test.findByPk(testId, {
			include: [{
				model: PracticeTest,
				required: true,
			}]
		});
		if (!test) {
			throw new DomainError(`Practice test not found`);
		}
		if (test.authorId !== credentials.userId) {
			throw new DomainError(`You are not the author of this test`);
		}
		return new AttemptsOfPracticeRead(test, credentials);
	}

	async getAttemptsOfTest(params: AttemptsOfTestQuery): Promise<Paged<AttemptInfo>> {
		const res = await this.attemptsQueryRepo.getAttemptsQuery({
			testId: this.test.id,
			...params,
		})
		return res;
	}

	async getAttemptsAggregate(): Promise<AttemptsOfTestAggregate> {
		return await this.testAttemptsQueryRepo.getAttemptsOfTestAggregate();
	}

	async getNumberOfSelfAttempts(): Promise<number> {
		return await this.testAttemptsQueryRepo.getNumberOfSelfAttempts(this.credentials.userId);
	}
}

