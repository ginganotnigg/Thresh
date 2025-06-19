import { Entity } from "../../shared/domain";
import { IdentityUtils } from "../../shared/domain/UniqueEntityId";
import { AttemptDto } from "../mappers/AttemptMapper";
import { AttemptPersistence } from "../mappers/AttemptMapper";

export class AttemptEntity extends Entity {
	private constructor(
		id: string,
		private readonly model: AttemptDto,
	) { super(id); }

	static createNew(candidateId: string, testId: string, order: number): AttemptEntity {
		const id = IdentityUtils.create();
		return new AttemptEntity(id, {
			id,
			candidateId,
			testId,
			order,
			hasEnded: false,
			secondsSpent: 0,
			status: "IN_PROGRESS",
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	static fromPersistence(persistenceData: AttemptPersistence): AttemptEntity {
		return new AttemptEntity(persistenceData.id, {
			id: persistenceData.id,
			candidateId: persistenceData.candidateId,
			testId: persistenceData.testId,
			order: persistenceData.order,
			hasEnded: persistenceData.hasEnded,
			secondsSpent: persistenceData.secondsSpent,
			status: persistenceData.status,
		});
	}

	public getCandidateId(): string {
		return this.model.candidateId;
	}

	public getOrder(): number {
		return this.model.order;
	}

	public getStartedDate(): Date {
		return this.model.createdAt || new Date();
	}

	public isActive(): boolean {
		return this.model.status === "IN_PROGRESS";
	}

	public getPerisistenceData(): AttemptPersistence {
		return {
			id: this.id,
			candidateId: this.model.candidateId,
			testId: this.model.testId,
			hasEnded: this.model.hasEnded,
			order: this.model.order,
			secondsSpent: this.model.secondsSpent,
			status: this.model.status,
		};
	}
}
