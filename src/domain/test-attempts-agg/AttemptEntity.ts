import { Entity } from "../../shared/domain";
import { IdentityUtils } from "../../shared/domain/UniqueEntityId";
import { AttemptDto, AttemptLoad, AttemptMapper } from "../_mappers/AttemptMapper";
import { AttemptPersistence } from "../_mappers/AttemptMapper";

export class AttemptEntity extends Entity {
	private constructor(
		id: string,
		private readonly model: AttemptDto,
	) { super(id); }

	static createNew(candidateId: string, testId: string, order: number): AttemptEntity {
		const id = IdentityUtils.create();
		return new AttemptEntity(id, {
			candidateId,
			testId,
			order,
			hasEnded: false,
			secondsSpent: 0,
			status: "IN_PROGRESS",
			createdAt: new Date(),
		});
	}

	static load(load: AttemptLoad): AttemptEntity {
		const dto = AttemptMapper.toDto(load);
		return new AttemptEntity(load.id, dto);
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
		return AttemptMapper.toPersistence(this.id, this.model, []);
	}
}
