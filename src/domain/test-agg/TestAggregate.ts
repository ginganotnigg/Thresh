import { AggregateRoot } from "../../shared/domain";
import { DomainError } from "../../shared/errors/domain.error";
import { QuestionDto, QuestionMapper, QuestionPersistence } from "../mappers/QuestionMapper";
import { TestDto, TestMapper, TestPersistence } from "../mappers/TestMapper";
import { QuestionEntity } from "./QuestionEntity";

export class TestAggregate extends AggregateRoot {
	private questions: QuestionEntity[] = [];

	private constructor(
		private testDto: TestDto,
		questionDtos: QuestionDto[],
		private hasAttempts: boolean = false,
	) {
		super(testDto.id);
		if (questionDtos.length === 0) {
			throw new DomainError("Test must have at least one question.");
		}
		this.questions = questionDtos.map(q => new QuestionEntity(q, testDto.id));
	}

	public static create(testDto: TestDto, questionDtos: QuestionDto[]): TestAggregate {
		return new TestAggregate(testDto, questionDtos);
	}

	public static fromPersistence(persistence: TestPersistence, questions: QuestionPersistence[], hasAttempts: boolean): TestAggregate {
		const testDto = TestMapper.toDto(persistence);
		const questionDtos = questions.map(q => QuestionMapper.toDto(q));
		return new TestAggregate(testDto, questionDtos, hasAttempts);
	}

	public update(testDto: Omit<TestDto, "id">): void {
		if (this.hasAttempts) {
			throw new DomainError("Cannot update test after attempts have been made.");
		}
		if (testDto.mode === "EXAM" && this.testDto.mode === "EXAM") {
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
		if (questions.length === 0) {
			throw new DomainError("Test must have at least one question.");
		}
		this.questions = questions.map(q => new QuestionEntity(q, this.testDto.id));
	}

	public toPersistence(): {
		test: TestPersistence;
		questions: QuestionPersistence[];
	} {
		const testPersistence = TestMapper.toPersistence(this.testDto);
		const questionsPersistence = this.questions.map(q => q.toPersistence());
		return {
			test: testPersistence,
			questions: questionsPersistence,
		};
	}
}