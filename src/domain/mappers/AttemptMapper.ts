import { AttemptStatusType } from "../../shared/enum";

export class AttemptMapper {
	static toPersistence(attemptId: string, attempt: AttemptDto): AttemptPersistence {
		return {
			id: attemptId,
			candidateId: attempt.candidateId,
			testId: attempt.testId,
			hasEnded: attempt.hasEnded,
			order: attempt.order,
			secondsSpent: attempt.secondsSpent,
			status: attempt.status,
		};
	}

	static toDto(attempt: AttemptPersistence): AttemptDto {
		return {
			id: attempt.id,
			candidateId: attempt.candidateId,
			testId: attempt.testId,
			hasEnded: attempt.hasEnded,
			order: attempt.order,
			secondsSpent: attempt.secondsSpent,
			status: attempt.status,
		};
	}
};

export type AttemptDto = {
	id: string;
	candidateId: string;
	testId: string;
	hasEnded: boolean;
	order: number;
	secondsSpent: number;
	status: AttemptStatusType;
	createdAt?: Date;
	updatedAt?: Date;
};

export type AttemptPersistence = {
	id: string;
	candidateId: string;
	testId: string;
	hasEnded: boolean;
	order: number;
	secondsSpent: number;
	status: AttemptStatusType;
	createdAt?: Date;
	updatedAt?: Date;
};
