import { DomainError } from "../../shared/errors/domain.error";
import { AttemptEntity } from "./AttemptEntity";
import { TestAttemptsAggregate } from "./TestAttemptsAggregate";

export class ExamAttemptsAggregate extends TestAttemptsAggregate {
	constructor(
		id: string,
		minutesToAnswer: number,
		attempts: AttemptEntity[],
		private readonly openDate: Date,
		private readonly closeDate: Date,
		private readonly participantList: string[],
		private readonly numberOfAttemptsAllowed: number,
	) {
		super(id, minutesToAnswer, attempts);
	}

	protected _checkAllowToDoTest(candidateId: string): void {
		super._checkAllowToDoTest(candidateId);
		const now = new Date();
		if (this.openDate > now) {
			throw new DomainError(`Exam is not started yet.`);
		}
		if (this.closeDate < now) {
			throw new DomainError(`Exam is already closed.`);
		}
		const isCandidateRegistered = this.participantList.includes(candidateId);
		if (isCandidateRegistered === false) {
			throw new DomainError(`Candidate is not participated in this exam.`);
		}
		if (this.numberOfAttemptsAllowed > 0 && this.numberOfAttemptsAllowed != null) {
			const numberOfAttempts = this.attempts.filter(attempt => attempt.getCandidateId() === candidateId).length;
			if (numberOfAttempts >= this.numberOfAttemptsAllowed) {
				throw new DomainError(`Candidate has reached the maximum number of attempts allowed for this exam.`);
			}
		}
	}
}
