import { AttemptStatusType } from "../../../../domain/enum";

export type AttemptModel = {
	candidateId: string;
	testId: string;
	hasEnded: number;
	order: number;
	secondsSpent: number;
	status: AttemptStatusType;
};

