import { Entity } from "../../shared/domain";
import { IdentityUtils } from "../../shared/domain/UniqueEntityId";
import { DomainError } from "../../shared/errors/domain.error";
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
		questionText: string;
		answerId: string;
		answer: string;
		correctAnswer: string;
		points: number;
	} | null {
		if (this.dto?.type === "LONG_ANSWER" && this.question.detail.type === "LONG_ANSWER") {
			return {
				questionText: this.question.text,
				answerId: this.id,
				answer: this.dto.answer,
				correctAnswer: this.question.detail.correctAnswer,
				points: this.question.points,
			};
		}
		return null;
	}

	getMCQPointsForEvaluation(): number | null {
		if (this.dto?.type === "MCQ" && this.question.detail.type === "MCQ") {
			if (this.dto.chosenOption == null) {
				return 0; // No option chosen, no points.
			}
			const correctOption = this.question.detail.correctOption;
			return this.dto.chosenOption === correctOption ? this.question.points : 0;
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

	updatePoints(points: number): void {
		if (this.dto === null) {
			throw new DomainError("Cannot set points on a cleared answer");
		}
		if (points < 0) {
			throw new DomainError("Points cannot be negative");
		}
		this.dto.pointsReceived = points;
	}
}