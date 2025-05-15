import { DomainError } from "../../../../controller/errors/domain.error";
import { CredentialsMeta } from "../../../../controller/schemas/meta";
import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import { AnswerCore } from "../../../../domain/schema/core.schema";
import { AttemptWithTest } from "../../schema/history.schema";
import { AttemptQueryRepo } from "../../../../domain/repo/attempt/attempt.query-repo";
import { AttemptsQueryRepo } from "../../../../domain/repo/attempt/attempts.query-repo";

export class CurrentAttemptRead {
	private readonly attemptsQueryRepo: AttemptsQueryRepo;
	private readonly attemptQueryRepo: AttemptQueryRepo;

	private constructor(
		private readonly attempt: Attempt,
	) {
		this.attemptsQueryRepo = new AttemptsQueryRepo();
		this.attemptQueryRepo = new AttemptQueryRepo(this.attempt);
	}

	static async load(attemptId: string, credentials: CredentialsMeta): Promise<CurrentAttemptRead> {
		const attempt = await Attempt.findByPk(attemptId, {
			include: [{
				model: Test,
				required: true,
			}],
		});
		if (!attempt || attempt.hasEnded === true || attempt.candidateId !== credentials.userId) {
			throw new DomainError(`Attempt not found or has ended`);
		}
		return new CurrentAttemptRead(attempt);
	}

	static async loadByTestId(testId: string, credentials: CredentialsMeta): Promise<CurrentAttemptRead> {
		const attempt = await new AttemptsQueryRepo().getCurrentAttemptByTestAndCandidate(testId, credentials.userId);
		if (!attempt) {
			throw new DomainError(`Attempt not found or has ended`);
		}
		return new CurrentAttemptRead(attempt);
	}

	async getAnswers(): Promise<AnswerCore[]> {
		return this.attemptQueryRepo.getAttemptAnswers();
	}

	getAttemptWithTest(): AttemptWithTest {
		return {
			...this.attempt.toJSON(),
			test: this.attempt.Test!.toJSON(),
		}
	}
}