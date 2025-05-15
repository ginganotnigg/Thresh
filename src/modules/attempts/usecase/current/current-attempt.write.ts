import { DomainError } from "../../../../controller/errors/domain.error";
import { CredentialsMeta } from "../../../../controller/schemas/meta";
import Attempt from "../../../../domain/models/attempt";
import { AttemptRepo } from "../../../../domain/repo/attempt/attempt.repo";

export class CurrentAttemptWrite {
	private readonly attemptRepo: AttemptRepo;

	private constructor(attempt: Attempt) {
		this.attemptRepo = new AttemptRepo(attempt);
	}

	static async load(attemptId: string, credentials: CredentialsMeta): Promise<CurrentAttemptWrite> {
		const attempt = await Attempt.findByPk(attemptId);
		if (!attempt || attempt.hasEnded || attempt.candidateId !== credentials.userId) {
			throw new DomainError(`Attempt not found or has already ended`);
		}
		return new CurrentAttemptWrite(attempt);
	}

	async answerQuestion({
		questionId,
		chosenOption,
	}: {
		questionId: number;
		chosenOption: number | null | undefined;
	}): Promise<void> {
		await this.attemptRepo.answerQuestion({
			questionId,
			chosenOption,
		});
	}

	async submit(): Promise<void> {
		await this.attemptRepo.submit();
	}

}