import { DomainError } from "../../../../controller/errors/domain.error";
import { CredentialsMeta } from "../../../../controller/schemas/meta";
import Attempt from "../../../../domain/models/attempt";
import Test from "../../../../domain/models/test";
import { AnswerCore } from "../../../../domain/schema/core.schema";
import { AttemptWithTest } from "../../schema/history.schema";
import { AttemptQueryRepo } from "../../../../domain/repo/attempt/attempt.query-repo";
import { AttemptsQueryRepo } from "../../../../domain/repo/attempt/attempts.query-repo";

export class CurrentAttemptRead {
	private readonly attemptQueryRepo: AttemptQueryRepo | null;

	private constructor(
		private readonly attempt: Attempt | null,
	) {
		this.attemptQueryRepo = attempt ? new AttemptQueryRepo(attempt) : null;
	}

	static async load(attemptId: string, credentials: CredentialsMeta): Promise<CurrentAttemptRead> {
		const attempt = await Attempt.findByPk(attemptId, {
			include: [{
				model: Test,
				required: true,
			}],
		});
		if (!attempt || attempt.hasEnded === true || attempt.candidateId !== credentials.userId) {
			return new CurrentAttemptRead(null);
		}
		return new CurrentAttemptRead(attempt);
	}

	static async loadByTestId(testId: string, credentials: CredentialsMeta): Promise<CurrentAttemptRead> {
		const attempt = await new AttemptsQueryRepo().getCurrentAttemptByTestAndCandidate(testId, credentials.userId);
		return new CurrentAttemptRead(attempt);
	}

	async getAnswers(): Promise<AnswerCore[]> {
		if (!this.attemptQueryRepo || !this.attempt) {
			throw new DomainError(`Current attempt not found`);
		}
		return this.attemptQueryRepo.getAttemptAnswers();
	}

	getAttemptWithTest(): AttemptWithTest | null {
		if (!this.attempt) {
			return null;
		}
		return {
			...this.attempt.toJSON(),
			test: this.attempt.Test!.toJSON(),
		}
	}
}