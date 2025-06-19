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
		return super._allowToDoTest(candidateId) && candidateId !== this.authorId;
	}
}
