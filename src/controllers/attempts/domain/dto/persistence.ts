import { AttemptStatusType } from "../../../../domain/enum";

export type AttemptPersistence = {
	id: string;
	candidateId: string;
	testId: string;
	hasEnded: boolean;
	order: number;
	secondsSpent: number;
	status: AttemptStatusType;
}

export type TestAttemptsPersistence = {
	testId: string;
	newAttempt: AttemptPersistence | null;
	modifedAttmepts: AttemptPersistence[];
	deletedAttempts: string[];
}