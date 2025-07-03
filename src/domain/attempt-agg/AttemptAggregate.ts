import { AggregateRoot } from "../../shared/domain";
import { DomainError } from "../../shared/errors/domain.error";
import { CredentialsBase } from "../../shared/types/credentials";
import { AttemptSubmittedEvent } from "../_events/AttemptSubmittedEvent";
import { AttemptDto, AttemptLoad, AttemptMapper, AttemptPersistence } from "../_mappers/AttemptMapper";
import { AnswerDto, AnswerPersistence } from "../_mappers/AnswerMapper";
import { AnswerEntity } from "./AnswerEntity";
import { QuestionDto } from "../_mappers/QuestionMapper";
import { TestModeType } from "../../shared/enum";

export class AttemptAggregate extends AggregateRoot {
	private readonly answersToUpdate: AnswerEntity[] = [];

	private constructor(
		id: string,
		private readonly testMode: TestModeType,
		private readonly attempt: AttemptDto,
		private readonly answers: AnswerEntity[],
	) { super(id); }

	private updateStatusAfterPointsEvaluation() {
		let isGradedAll = true;
		for (const answer of this.answers) {
			if (answer.getIsGraded() === false) {
				isGradedAll = false;
				break;
			}
		}
		if (isGradedAll) {
			this.attempt.status = "GRADED";
		}
	}

	private endTest() {
		if (this.attempt.status !== "IN_PROGRESS") {
			throw new DomainError(`Attempt has ended.`);
		}
		this.attempt.status = "COMPLETED";
		this.attempt.hasEnded = true;
		this.attempt.secondsSpent = Math.floor((Date.now() - this.attempt.createdAt.getTime()) / 1000);

		// Automatically grade all MCQ questions that are not graded yet
		for (const answer of this.answers) {
			if (answer.getIsGraded() === false) {
				const getMcqPoints = answer.getMCQPointsForEvaluation();
				if (getMcqPoints !== null) {
					answer.updatePoints(getMcqPoints);
					this.answersToUpdate.push(answer);
				}
			}
		}
		this.updateStatusAfterPointsEvaluation();
		this.addDomainEvent(new AttemptSubmittedEvent(this.id));
	}

	static load(load: AttemptLoad): AttemptAggregate {
		const dto = AttemptMapper.toDto(load);
		const answerEntities = load.answers.map((answer) => AnswerEntity.load(answer));
		return new AttemptAggregate(load.id, load.test.mode, dto, answerEntities);
	}

	submit(credentials: CredentialsBase): void {
		if (this.attempt.candidateId !== credentials.userId) {
			throw new DomainError(`This is not your attempt`);
		}
		this.endTest();
	}

	answerQuestion(credentials: CredentialsBase, questionId: number, question: QuestionDto, answer: AnswerDto | null): void {
		if (this.attempt.status !== "IN_PROGRESS") {
			throw new DomainError(`Attempt has ended.`);
		}
		if (this.attempt.candidateId !== credentials.userId) {
			throw new DomainError(`This is not your attempt`);
		}
		this.answersToUpdate.push(AnswerEntity.create(this.id, questionId, question, answer));
	}

	timeOut(): void {
		this.endTest();
	}

	getPersistenceData(): AttemptPersistence {
		const updatedAnswers: AnswerPersistence[] = this.answersToUpdate.map((answer) => answer.toPersistence());
		return AttemptMapper.toPersistence(this.id, this.attempt, updatedAnswers);
	}

	getEvaluationData(): {
		questionText: string;
		answerId: string;
		answer: string;
		correctAnswer: string;
		points: number;
	}[] {
		return this.answers
			.map((answer) => answer.getLongAnswerContentForEvaluation())
			.filter(x => x !== null);
	}

	getCandidateId(): string {
		return this.attempt.candidateId;
	}

	getTestMode(): TestModeType {
		return this.testMode;
	}

	updateAnswerEvaluation(point: number, answerId: string): void {
		const foundAnswer = this.answers.find((a) => a.id === answerId);
		if (!foundAnswer) {
			throw new DomainError(`Answer not found for this Attempt`);
		}
		foundAnswer.updatePoints(point);
		this.answersToUpdate.push(foundAnswer);
		this.updateStatusAfterPointsEvaluation();
	}

	forceScore(): void {
		if (this.attempt.status !== "COMPLETED") {
			throw new DomainError(`Can only force score a completed attempt.`);
		}
		for (const answer of this.answers) {
			if (answer.getIsGraded() === false) {
				answer.updatePoints(0);
				this.answersToUpdate.push(answer);
			}
		}
		this.updateStatusAfterPointsEvaluation();
	}
}