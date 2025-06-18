import { AggregateRoot } from "../../../shared/domain";
import { TestAttemptsPersistence } from "../mappers/TestAttemptsMapper";
import { AttemptEntity } from "./AttemptEntity";

export abstract class TestAttemptsAggregate extends AggregateRoot {
	private newAttempt: AttemptEntity | null = null;

	constructor(
		id: string,
		protected readonly attempts: AttemptEntity[],
	) { super(id); }

	protected _allowToDoTest(candidateId: string): boolean {
		const hasActiveAttempt = this.attempts.some(attempt => attempt.getCandidateId() === candidateId && attempt.isActive());
		return hasActiveAttempt === false;
	}

	public addNewAttempt(candidateId: string): void {
		const testId = this.id;
		if (this._allowToDoTest(candidateId) === false) {
			throw new Error(`Candidate ${candidateId} is not allowed to take the test ${testId}`);
		}
		const newAttempt = AttemptEntity.createNew(candidateId, testId, this.attempts.length + 1);
		this.newAttempt = newAttempt;
		this.attempts.push(newAttempt);
	}

	public getPersistenceData(): TestAttemptsPersistence {
		return {
			testId: this.id,
			newAttempt: this.newAttempt?.getPerisistenceData() || null,
			modifedAttmepts: [],
			deletedAttempts: [],
		};
	}
}


