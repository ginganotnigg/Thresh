import { DomainError } from "../../shared/errors/domain.error";
import { AttemptEntity } from "./AttemptEntity";
import { TestAttemptsAggregate } from "./TestAttemptsAggregate";

export class PracticeAttemptsAggregate extends TestAttemptsAggregate {
	constructor(
		id: string,
		minutesToAnswer: number,
		attempts: AttemptEntity[],
		private readonly authorId: string,
	) {
		super(id, minutesToAnswer, attempts);
	}

	protected _allowToDoTest(candidateId: string): boolean {
		super._allowToDoTest(candidateId);
		const practiceCheck = candidateId === this.authorId;
		if (practiceCheck === false) {
			throw new DomainError(`Candidate is not the author of this Practice Test.`);
		}
		return true;
	}
}
