import { AggregateRoot } from "../../shared/domain";
import { DomainError } from "../../shared/errors/domain.error";
import { CredentialsBase } from "../../shared/policy/types";
import { AnswerDto, AnswerMapper, AnswerPersistence } from "./mappers/AnswerMapper";
import { AttemptDto } from "./mappers/AttemptMapper";
import { QuestionDto } from "./mappers/QuestionMapper";

export class AnswerAggregate extends AggregateRoot<{ questionId: number; attemptId: string }> {
	private constructor(
		private readonly questionId: number,
		private readonly attemptId: string,
		private readonly answer: AnswerDto | null,
	) { super({ questionId, attemptId }); }

	static create(
		answer: AnswerDto | null,
		attempt: AttemptDto,
		question: QuestionDto,
		credential: CredentialsBase,
	): AnswerAggregate {
		if (attempt.status !== "IN_PROGRESS") {
			throw new DomainError("Cannot create answer for a completed attempt.");
		}
		if (attempt.candidateId !== credential.userId) {
			throw new DomainError("Cannot create answer for an attempt that does not belong to the candidate.");
		}
		if (answer !== null && question.type !== answer.type) {
			throw new DomainError("Answer type does not match question type.");
		}
		return new AnswerAggregate(question.id, attempt.id, answer);
	}

	toPersistence(): AnswerPersistence {
		return AnswerMapper.toPersistence({
			questionId: this.questionId,
			attemptId: this.attemptId,
			answer: this.answer,
		});
	}
}