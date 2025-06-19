import { Entity } from "../../shared/domain";
import { QuestionDto, QuestionMapper, QuestionPersistence } from "../mappers/QuestionMapper";

export class QuestionEntity extends Entity<number> {
	constructor(
		private readonly dto: QuestionDto,
		private readonly testId: string,
	) { super(dto.id); }

	public toPersistence(): QuestionPersistence {
		const persistence: QuestionPersistence = QuestionMapper.toPersistence(this.dto, this.testId);
		return persistence;
	}
}