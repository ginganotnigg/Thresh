import { AggregateRoot } from "../../shared/domain";
import { DomainError } from "../../shared/errors/domain.error";
import { AttemptCreatedEvent } from "../_events/AttemptCreatedEvent";
import { TestAttemptsPersistence } from "../_mappers/TestAttemptsMapper";
import { AttemptEntity } from "./AttemptEntity";

export abstract class TestAttemptsAggregate extends AggregateRoot {
	private newAttempt: AttemptEntity | null = null;

	constructor(
		id: string,
		private readonly miniutesToAnswer: number,
		protected readonly attempts: AttemptEntity[],
	) { super(id); }

	protected _allowToDoTest(candidateId: string): boolean {
		const hasActiveAttempt = this.attempts.some(attempt => attempt.getCandidateId() === candidateId && attempt.isActive());
		if (hasActiveAttempt === true) {
			throw new DomainError(`Candidate already has an ongoing attempt.`);
		}
		return true;
	}

	public addNewAttempt(candidateId: string): string {
		const testId = this.id;
		if (this._allowToDoTest(candidateId) === false) {
			throw new DomainError(`Candidate is not allowed to take the test.`);
		}
		const newAttempt = AttemptEntity.createNew(candidateId, testId, this.attempts.length + 1);
		this.newAttempt = newAttempt;
		this.attempts.push(newAttempt);
		const endDate = new Date(newAttempt.getStartedDate().getTime() + this.miniutesToAnswer * 1000 * 60);
		this.addDomainEvent(new AttemptCreatedEvent(newAttempt.id, endDate));
		return newAttempt.id;
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


