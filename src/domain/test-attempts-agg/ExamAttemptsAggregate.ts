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

	protected _allowToDoTest(candidateId: string): boolean {
		const now = new Date();
		const isOpen = this.openDate <= now && now <= this.closeDate;

		const isCandidateRegistered = this.participantList.includes(candidateId);

		const numberOfAttempts = this.attempts.filter(attempt => attempt.getCandidateId() === candidateId).length;
		const hasNotReachedMaxAttempt = numberOfAttempts === 0 ? true : numberOfAttempts < this.numberOfAttemptsAllowed;

		return super._allowToDoTest(candidateId) &&
			isOpen === true &&
			isCandidateRegistered === true &&
			hasNotReachedMaxAttempt === true
			;
	}
}
