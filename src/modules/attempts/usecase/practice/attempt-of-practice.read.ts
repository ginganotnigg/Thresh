import { DomainError } from "../../../../controller/errors/domain.error";
import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import { AnswerCore } from "../../../../domain/schema/core.schema";
import { AttemptInfo } from "../../../../domain/schema/info.schema";
import { CredentialsMeta } from "../../../../controller/schemas/meta";
import { AttemptAggregate } from "../../schema/test.schema";
import { AttemptQueryRepo } from "../../../../domain/repo/attempt/attempt.query-repo";
import PracticeTest from "../../../../domain/models/practice_test";

export class AttemptOfPracticeRead {
	private readonly attemptQueryRepo: AttemptQueryRepo;

	private constructor(
		private readonly attempt: Attempt,
	) {
		this.attemptQueryRepo = new AttemptQueryRepo(this.attempt);
	}

	static async create(attemptId: string, credentials: CredentialsMeta): Promise<AttemptOfPracticeRead> {
		const attempt = await Attempt.findByPk(attemptId, {
			include: [{
				model: Test,
				required: true,
				include: [{
					model: PracticeTest,
					required: true,
				}]
			}],
		});
		if (!attempt) {
			throw new DomainError(`Attempt not found`);
		}
		if (attempt.Test!.authorId !== credentials.userId) {
			throw new DomainError(`You are not the author of this test`);
		}
		return new AttemptOfPracticeRead(attempt);
	}

	async getAttemptAggregate(): Promise<AttemptAggregate> {
		return this.attemptQueryRepo.getAttemptAggregate();
	}

	async getAttemptAnswers(): Promise<AnswerCore[]> {
		return this.attemptQueryRepo.getAttemptAnswers();
	}

	async getAttempt(): Promise<AttemptInfo> {
		return {
			...this.attempt.toJSON(),
		};
	}
}
