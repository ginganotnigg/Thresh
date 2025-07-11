import { AggregateRoot } from "../../shared/domain";
import { IdentityUtils } from "../../shared/domain/UniqueEntityId";
import { DomainError } from "../../shared/errors/domain.error";
import { QuestionDto, QuestionMapper, QuestionPersistence } from "../_mappers/QuestionMapper";
import { TestDto, TestLoad, TestMapper, TestPersistence } from "../_mappers/TestMapper";
import { QuestionEntity } from "./QuestionEntity";

export class TestAggregate extends AggregateRoot {
	private questions: QuestionEntity[] = [];

	private constructor(
		id: string,
		private testDto: TestDto,
		questionDtos: QuestionDto[],
		private hasAttempts: boolean,
		private hasParticipants: boolean,
	) {
		super(id);
		this.questions = questionDtos.map(q => QuestionEntity.create(q, id));
	}

	private validate(): void {
		const test = this.testDto;
		const questions = this.questions;
		if (test.detail.mode === "EXAM") {
			const {
				closeDate,
				openDate,

			} = test.detail;
			if (closeDate <= openDate) {
				throw new DomainError("Close date must be after open date.");
			}
			const distance = closeDate.getTime() - openDate.getTime();
			if (distance > 1000 * 60 * 60 * 24 * 60) {
				throw new DomainError("Exam cannot be longer than 60 days.");
			}
		}
		if (questions.length === 0) {
			throw new DomainError("Test must have at least one question.");
		}
		if (questions.length > 100) {
			throw new DomainError("Test cannot have more than 100 questions.");
		}
	}

	public static create(testDto: TestDto, questionDtos: QuestionDto[]): TestAggregate {
		const id = IdentityUtils.create();
		const newExam = new TestAggregate(id, testDto, questionDtos, false, false);
		newExam.validate();
		return newExam;
	}

	public static fromPersistence(persistence: TestLoad, questions: QuestionPersistence[]): TestAggregate {
		const testDto = TestMapper.toDto(persistence);
		const questionDtos = questions.map(q => QuestionMapper.toDto(q));
		return new TestAggregate(
			persistence.id,
			testDto,
			questionDtos,
			persistence.hasAttempts,
			persistence.hasParticipants
		);
	}

	public update(testDto: TestDto): void {
		if (testDto.detail.mode === "EXAM" && this.testDto.detail.mode === "EXAM") {
			const newExamData = testDto.detail;
			if (newExamData.roomId !== this.testDto.detail.roomId) {
				throw new DomainError("Cannot change room ID of an exam test.");
			}
			if (this.hasAttempts === true) {
				if (newExamData.openDate > this.testDto.detail.openDate) {
					throw new DomainError("Cannot change open date to a later date than the current one after attempts have been made.");
				}
				if (newExamData.closeDate < this.testDto.detail.closeDate) {
					throw new DomainError("Cannot change close date to an earlier date than the current one after attempts have been made.");
				}
				if (
					(
						newExamData.numberOfAttemptsAllowed !== 0 &&
						newExamData.numberOfAttemptsAllowed < this.testDto.detail.numberOfAttemptsAllowed
					)
				) {
					throw new DomainError("Cannot reduce the number of attempts allowed after attempts have been made.");
				}
			}

			if (this.hasParticipants === true) {
				if (newExamData.numberOfParticipants !== this.testDto.detail.numberOfParticipants) {
					throw new DomainError("Cannot change number of participants after participants have joined.");
				}
			}
			this.testDto = {
				...this.testDto,
				...testDto,
				mode: "EXAM",
			};
		}
		else if (testDto.mode === "PRACTICE" && this.testDto.mode === "PRACTICE") {
			this.testDto = {
				...this.testDto,
				...testDto,
				mode: "PRACTICE",
			};
		}
		else {
			throw new DomainError("Cannot update test mode from one type to another.");
		}
	}

	public updateQuestions(questions: QuestionDto[]): void {
		if (this.hasAttempts) {
			throw new DomainError("Cannot update questions after attempts have been made.");
		}
		this.questions = questions.map(q => QuestionEntity.create(q, this.id));
		this.validate();
	}

	public toPersistence(): {
		test: TestPersistence;
		questions: QuestionPersistence[];
	} {
		const testPersistence = TestMapper.toPersistence(
			this.testDto,
			this.id,
		);
		const questionsPersistence = this.questions.map(q => q.toPersistence());
		return {
			test: testPersistence,
			questions: questionsPersistence,
		};
	}
}