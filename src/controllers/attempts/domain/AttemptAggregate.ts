import { AggregateRoot } from "../../shared/domain";
import { DomainError } from "../../shared/errors/domain.error";
import { CredentialsBase } from "../../shared/policy/types";
import { AttemptDto, AttemptMapper, AttemptPersistence } from "./mappers/AttemptMapper";

export class AttemptAggregate extends AggregateRoot {
	private constructor(
		id: string,
		private readonly attempt: AttemptDto,
	) { super(id); }

	static fromPersistence(persistence: AttemptPersistence): AttemptAggregate {
		const dto = AttemptMapper.toDto(persistence);
		return new AttemptAggregate(
			persistence.id,
			dto,
		);
	}

	submit(credentials: CredentialsBase): void {
		if (this.attempt.candidateId !== credentials.userId) {
			throw new DomainError(`This is not your attempt`);
		}
		if (this.attempt.status !== "IN_PROGRESS") {
			throw new DomainError(`Attempt has ended.`);
		}
		this.attempt.status = "COMPLETED";
		this.attempt.hasEnded = true;
		this.attempt.secondsSpent = Math.floor((Date.now() - this.attempt.createdAt!.getTime()) / 1000);
	}

	getPersistenceData(): AttemptPersistence {
		return AttemptMapper.toPersistence(this.id, this.attempt);
	}
}