import Test from "../../../../domain/models/test";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import { Paged } from "../../../../controller/schemas/base";
import { CredentialsMeta } from "../../../../controller/schemas/meta";
import { DomainError } from "../../../../controller/errors/domain.error";
import { TestAttemptsQueryRepo } from "../../../../domain/repo/attempt/test-attemps.query-repo";
import { AttemptsOfTestAggregate, AttemptsOfTestQuery } from "../../schema/test.schema";
import { AttemptsQueryRepo } from "../../../../domain/repo/attempt/attempts.query-repo";
import PracticeTest from "../../../../domain/models/practice_test";

export class AttemptsOfPracticeRead {
	private readonly attemptsQueryRepo: AttemptsQueryRepo;
	private readonly testAttemptsQueryRepo: TestAttemptsQueryRepo;

	private constructor(
		private readonly test: Test,
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
		return new AttemptsOfPracticeRead(test);
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
}

