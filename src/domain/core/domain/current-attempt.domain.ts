import { DomainError } from "../../../controller/errors/domain.error";
import { AttemptCore } from "../../schema/core.schema";
import { AttemptRepo } from "../repo/attempt.repo";

export class CurrentAttemptDomain {
	private constructor(
		private readonly attemptCore: AttemptCore,
	) { }

	static async load({
		testId,
		candidateId,
	}: {
		testId: string;
		candidateId: string;
	}): Promise<CurrentAttemptDomain> {
		const attempt = await AttemptRepo.loadCurrentAttempt(testId, candidateId);
		if (attempt == null) {
			throw new DomainError("User has not joined the test");
		}
		return new CurrentAttemptDomain(attempt);
	}

	async answerQuestion({
		questionId,
		chosenOption,
	}: {
		questionId: number;
		chosenOption: number | null | undefined;
	}): Promise<void> {
		if (this.attemptCore.hasEnded) {
			throw new DomainError("Attempt has already ended");
		}
		await AttemptRepo.upsertOrDeleteAnswer({
			attemptId: this.attemptCore.id,
			questionId,
			chosenOption,
		});
	}

	async submit(): Promise<void> {
		if (this.attemptCore.hasEnded) {
			throw new DomainError("Attempt has already ended");
		}
		const now = new Date();
		const secondsSpent = Math.floor((now.getTime() - this.attemptCore.createdAt.getTime()) / 1000);
		this.attemptCore.secondsSpent = secondsSpent;
		this.attemptCore.hasEnded = true;
		await AttemptRepo.updateAttempt(this.attemptCore);
	}
}