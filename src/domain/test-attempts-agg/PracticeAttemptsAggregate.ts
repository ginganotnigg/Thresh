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

	protected _checkAllowToDoTest(candidateId: string): void {
		super._checkAllowToDoTest(candidateId);
		const practiceCheck = candidateId === this.authorId;
		if (practiceCheck === false) {
			throw new DomainError(`You are not the author of this Test.`);
		}
	}
}
