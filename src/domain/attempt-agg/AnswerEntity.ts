import { Entity } from "../../shared/domain";
import { IdentityUtils } from "../../shared/domain/UniqueEntityId";
import { AnswerDto, AnswerLoad, AnswerPersistence } from "../_mappers/AnswerMapper";
import { AnswerMapper } from "../_mappers/AnswerMapper";
import { QuestionDto, QuestionMapper } from "../_mappers/QuestionMapper";

export class AnswerEntity extends Entity {
	private constructor(
		id: string,
		private readonly attemptId: string,
		private readonly questionId: number,
		private readonly question: QuestionDto,
		private dto: AnswerDto | null,
	) { super(id); }

	static create(
		attemptId: string,
		questionId: number,
		question: QuestionDto,
		answer: AnswerDto | null,
	): AnswerEntity {
		const id = IdentityUtils.create();
		return new AnswerEntity(id, attemptId, questionId, question, answer);
	}

	static load(load: AnswerLoad): AnswerEntity {
		const dto = AnswerMapper.toDto(load);
		const questionDto = QuestionMapper.toDto(load.question);
		return new AnswerEntity(load.id, load.attemptId, load.question.id, questionDto, dto);
	}

	toPersistence(): AnswerPersistence {
		if (this.dto === null) {
			return AnswerMapper.toDeletePersistence(this.id, this.attemptId, this.questionId);
		}
		return AnswerMapper.toPersistence(this.id, this.attemptId, this.questionId, this.dto);
	}

	getLongAnswerContentForEvaluation(): {
		answerId: string;
		answer: string;
		correctAnswer: string;
		points: number;
	} | null {
		if (this.dto?.type === "LONG_ANSWER" && this.question.detail.type === "LONG_ANSWER") {
			return {
				answerId: this.id,
				answer: this.dto.answer,
				correctAnswer: this.question.detail.correctAnswer,
				points: this.question.points,
			};
		}
		return null;
	}

	setPoints(points: number): void {
		if (this.dto === null) {
			throw new Error("Cannot set points on a cleared answer");
		}
		this.dto.pointsRecieved = points;
	}
}