import { AggregateRoot } from "../../shared/domain";
import { DomainError } from "../../shared/errors/domain.error";
import { CredentialsBase } from "../../shared/types/credentials";
import { AttemptSubmittedEvent } from "../_events/AttemptSubmittedEvent";
import { AttemptDto, AttemptLoad, AttemptMapper, AttemptPersistence } from "../_mappers/AttemptMapper";
import { AnswerDto, AnswerPersistence } from "../_mappers/AnswerMapper";
import { AnswerEntity } from "./AnswerEntity";
import { QuestionDto, QuestionLoad } from "../_mappers/QuestionMapper";
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

	private endTest(questions: QuestionLoad[], testLanguage: string): void {
		if (this.attempt.status !== "IN_PROGRESS") {
			return; // No need to end if already completed or graded
		}
		this.attempt.status = "COMPLETED";
		this.attempt.hasEnded = true;
		this.attempt.secondsSpent = Math.floor((Date.now() - this.attempt.createdAt.getTime()) / 1000);
		const pointsMap: Map<number, QuestionLoad> = new Map();

		// Map question IDs to their points
		for (const question of questions) {
			pointsMap.set(question.id, question);
		}

		// Grade all MCQ questions that are not graded yet
		for (const answer of this.answers) {
			if (answer.getIsGraded() === false) {
				const question = pointsMap.get(answer.getQuestionId());
				if (question !== undefined && question.detail.type === "MCQ") {
					answer.scoreMCQ(question.detail.correctOption, question.points);
					this.answersToUpdate.push(answer);
				}
			}
		}
		this.updateStatusAfterPointsEvaluation();
		this.addDomainEvent(new AttemptSubmittedEvent(this.id, this.attempt.testId, questions, testLanguage));

		console.log(`Answer to update:`, this.answersToUpdate.map(a => a.toPersistence()));
	}

	static load(load: AttemptLoad): AttemptAggregate {
		const dto = AttemptMapper.toDto(load);
		const answerEntities = load.answers.map((answer) => AnswerEntity.load(answer));
		return new AttemptAggregate(load.id, load.test.mode, dto, answerEntities);
	}

	submit(credentials: CredentialsBase, questions: QuestionLoad[], testLanguage: string): void {
		if (this.attempt.candidateId !== credentials.userId) {
			throw new DomainError(`This is not your attempt`);
		}
		if (this.attempt.status !== "IN_PROGRESS") {
			throw new DomainError(`Attempt has already ended.`);
		}
		this.endTest(questions, testLanguage);
	}

	timeOut(questions: QuestionLoad[], testLanguage: string): void {
		this.endTest(questions, testLanguage);
	}

	answerQuestions(credentials: CredentialsBase, answersWithQuestions: {
		questionId: number;
		answer: AnswerDto | null;
	}[]): void {
		if (this.attempt.status !== "IN_PROGRESS") {
			throw new DomainError(`Attempt has ended.`);
		}
		if (this.attempt.candidateId !== credentials.userId) {
			throw new DomainError(`This is not your attempt`);
		}
		for (const { questionId, answer } of answersWithQuestions) {
			this.answersToUpdate.push(AnswerEntity.create(this.id, questionId, answer));
		}
	}

	getPersistenceData(): AttemptPersistence {
		const updatedAnswers: AnswerPersistence[] = this.answersToUpdate.map((answer) => answer.toPersistence());
		return AttemptMapper.toPersistence(this.id, this.attempt, updatedAnswers);
	}

	getEvaluationData(): {
		questionId: number;
		answerId: string;
		answer: string;
	}[] {
		return this.answers
			.map((answer) => answer.getLongAnswerContentForEvaluation())
			.filter(x => x !== null);
	}

	getCandidateId(): string {
		return this.attempt.candidateId;
	}

	getTestId(): string {
		return this.attempt.testId;
	}

	getTestMode(): TestModeType {
		return this.testMode;
	}

	updateAnswerEvaluation(point: number, answerId: string, comment?: string): void {
		const foundAnswer = this.answers.find((a) => a.id === answerId);
		if (!foundAnswer) {
			throw new DomainError(`Answer not found for this Attempt`);
		}
		foundAnswer.score(point, comment);
		this.answersToUpdate.push(foundAnswer);
		this.updateStatusAfterPointsEvaluation();
	}

	forceScore(): void {
		for (const answer of this.answers) {
			if (answer.getIsGraded() === false) {
				answer.score(0, "Auto-graded: No points received");
				this.answersToUpdate.push(answer);
			}
		}
		this.updateStatusAfterPointsEvaluation();
	}
}