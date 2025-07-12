import { Entity } from "../../shared/domain";
import { DomainError } from "../../shared/errors/domain.error";
import { QuestionDto, QuestionMapper, QuestionPersistence } from "../_mappers/QuestionMapper";

export class QuestionEntity extends Entity<number> {
	private constructor(
		id: number,
		private readonly dto: QuestionDto,
		private readonly testId: string,
		private readonly isToUpdate: boolean,
	) { super(id); }

	public static load(id: number, dto: QuestionDto, testId: string, isToUpdate: boolean): QuestionEntity {
		if (dto.detail.type === "MCQ") {
			if (dto.detail.correctOption < 0 || dto.detail.correctOption >= dto.detail.options.length) {
				throw new DomainError("Correct option index is out of bounds.");
			}
		}
		return new QuestionEntity(id, dto, testId, isToUpdate);
	}

	public static create(dto: QuestionDto, testId: string, isToUpdate: boolean): QuestionEntity {
		return this.load(-1, dto, testId, isToUpdate);
	}

	private toPersistence(): QuestionPersistence {
		const persistence: QuestionPersistence = QuestionMapper.toPersistence(this.dto, this.id, this.testId);
		return persistence;
	}

	public toOptionalPersistence(): QuestionPersistence | null {
		if (this.isToUpdate) {
			return this.toPersistence();
		}
		return null;
	}
}