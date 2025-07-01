import { AttemptStatusType, TestModeType } from "../../shared/enum";
import { AnswerLoad, AnswerPersistence } from "./AnswerMapper";

export type AttemptDto = {
	candidateId: string;
	testId: string;
	hasEnded: boolean;
	order: number;
	secondsSpent: number;
	status: AttemptStatusType;
	createdAt: Date;
};

export type AttemptLoad = AttemptDto & {
	id: string;
	test: {
		mode: TestModeType;
	},
	answers: AnswerLoad[];
}

export type AttemptPersistence = AttemptDto & {
	id: string;
	updatedAnswers: AnswerPersistence[];
}

export class AttemptMapper {
	static toPersistence(attemptId: string, attempt: AttemptDto, updatedAnswers: AnswerPersistence[]): AttemptPersistence {
		return {
			id: attemptId,
			candidateId: attempt.candidateId,
			testId: attempt.testId,
			hasEnded: attempt.hasEnded,
			order: attempt.order,
			secondsSpent: attempt.secondsSpent,
			status: attempt.status,
			createdAt: attempt.createdAt,
			updatedAnswers: updatedAnswers,
		};
	}

	static toDto(attempt: AttemptLoad): AttemptDto {
		return {
			candidateId: attempt.candidateId,
			testId: attempt.testId,
			hasEnded: attempt.hasEnded,
			order: attempt.order,
			secondsSpent: attempt.secondsSpent,
			status: attempt.status,
			createdAt: attempt.createdAt,
		};
	}
};

