import { AggregateRoot } from "../../shared/domain";
import { DomainError } from "../../shared/errors/domain.error";
import { CredentialsBase } from "../../shared/policy/types";
import { AttemptEndedEvent } from "../_events/AttemptSubmittedEvent";
import { AttemptDto, AttemptLoad, AttemptMapper, AttemptPersistence } from "../_mappers/AttemptMapper";
import { AnswerDto, AnswerPersistence } from "../_mappers/AnswerMapper";
import { AnswerEntity } from "./AnswerEntity";
import { QuestionDto } from "../_mappers/QuestionMapper";

export class AttemptAggregate extends AggregateRoot {
	private readonly answersToUpdate: AnswerEntity[] = [];

	private constructor(
		id: string,
		private readonly attempt: AttemptDto,
		private readonly answers: AnswerEntity[],
	) { super(id); }

	private endTest() {
		if (this.attempt.status !== "IN_PROGRESS") {
			throw new DomainError(`Attempt has ended.`);
		}
		this.attempt.status = "COMPLETED";
		this.attempt.hasEnded = true;
		this.attempt.secondsSpent = Math.floor((Date.now() - this.attempt.createdAt.getTime()) / 1000);
		this.addDomainEvent(new AttemptEndedEvent(this.id));
	}

	static load(load: AttemptLoad): AttemptAggregate {
		const dto = AttemptMapper.toDto(load);
		const answerEntities = load.answers.map((answer) => AnswerEntity.load(answer));
		return new AttemptAggregate(load.id, dto, answerEntities);
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
		answerId: string;
		answer: string;
		correctAnswer: string;
		points: number;
	}[] {
		return this.answersToUpdate
			.map((answer) => answer.getLongAnswerContentForEvaluation())
			.filter(x => x !== null);
	}

	setEvaluatedPoints(poinstOfAnswers: {
		point: number;
		answerId: string;
	}[]): void {
		for (const poa of poinstOfAnswers) {
			const foundAnswer = this.answers.find((a) => a.id === poa.answerId);
			if (!foundAnswer) {
				throw new Error(`Answer with id ${poa.answerId} not found in attempt ${this.id}`);
			}
			foundAnswer.setPoints(poa.point);
			this.answersToUpdate.push(foundAnswer);
		}
	}
}