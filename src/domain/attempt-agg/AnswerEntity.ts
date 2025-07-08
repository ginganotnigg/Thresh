import { Entity } from "../../shared/domain";
import { IdentityUtils } from "../../shared/domain/UniqueEntityId";
import { DomainError } from "../../shared/errors/domain.error";
import { AnswerDto, AnswerLoad, AnswerPersistence } from "../_mappers/AnswerMapper";
import { AnswerMapper } from "../_mappers/AnswerMapper";

export class AnswerEntity extends Entity {
	private constructor(
		id: string,
		private readonly attemptId: string,
		private readonly questionId: number,
		private readonly dto: AnswerDto | null,
	) { super(id); }

	static create(
		attemptId: string,
		questionId: number,
		answer: AnswerDto | null,
	): AnswerEntity {
		const id = IdentityUtils.create();
		return new AnswerEntity(id, attemptId, questionId, answer);
	}

	static load(load: AnswerLoad): AnswerEntity {
		const dto = AnswerMapper.toDto(load);
		return new AnswerEntity(load.id, load.attemptId, load.questionId, dto);
	}

	toPersistence(): AnswerPersistence {
		if (this.dto === null) {
			return AnswerMapper.toDeletePersistence(this.id, this.attemptId, this.questionId);
		}
		return AnswerMapper.toPersistence(this.id, this.attemptId, this.questionId, this.dto);
	}

	getQuestionId(): number {
		return this.questionId;
	}

	getLongAnswerContentForEvaluation(): {
		questionId: number;
		answerId: string;
		answer: string;
	} | null {
		if (this.dto?.type === "LONG_ANSWER") {
			return {
				questionId: this.questionId,
				answerId: this.id,
				answer: this.dto.answer,
			};
		}
		return null;
	}

	/**
	 * Checks if the answer is graded.
	 * @returns true if the answer is graded, false otherwise.
	 */
	getIsGraded(): boolean {
		// If the answer is mark as cleared, it can also be count as graded (0 points).
		if (this.dto === null) {
			return true;
		}
		return this.dto.pointsReceived != null;
	}

	scoreMCQ(correctOption: number, points: number): void {
		if (this.dto === null) {
			throw new DomainError("Cannot set points on a cleared answer");
		}
		if (points < 0) {
			throw new DomainError("Points cannot be negative");
		}
		if (this.dto.type !== "MCQ") {
			throw new DomainError("Score MCQ Points can only be set on MCQ answers");
		}
		if (this.dto.chosenOption !== correctOption) {
			this.dto.pointsReceived = 0;
		}
		else {
			this.dto.pointsReceived = points;
		}
	}

	score(points: number, comment?: string): void {
		if (this.dto === null) {
			throw new DomainError("Cannot set points on a cleared answer");
		}
		if (points < 0) {
			throw new DomainError("Points cannot be negative");
		}
		this.dto.pointsReceived = points;
		if (this.dto.type === "LONG_ANSWER") {
			this.dto.comment = comment || undefined;
		}
	}
}