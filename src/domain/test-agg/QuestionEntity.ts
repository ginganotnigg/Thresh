import { Entity } from "../../shared/domain";
import { QuestionDto, QuestionMapper, QuestionPersistence } from "../_mappers/QuestionMapper";

export class QuestionEntity extends Entity<number> {
	private constructor(
		id: number,
		private readonly dto: QuestionDto,
		private readonly testId: string,
	) { super(id); }

	public static create(dto: QuestionDto, testId: string): QuestionEntity {
		const id = -1; // Use -1 to indicate a new question that hasn't been persisted yet
		if (dto.detail.type === "MCQ") {
			if (dto.detail.correctOption < 0 || dto.detail.correctOption >= dto.detail.options.length) {
				throw new Error("Correct option index is out of bounds.");
			}
		}
		return new QuestionEntity(id, dto, testId);
	}

	public toPersistence(): QuestionPersistence {
		const persistence: QuestionPersistence = QuestionMapper.toPersistence(this.dto, this.id, this.testId);
		return persistence;
	}
}