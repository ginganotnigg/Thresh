export type SmallAttemptCast = {
	ID: string;
	createdAt: Date;
	Test: {
		minutesToAnswer: number;
	}
}

export type AttemptChoiceCast = {
	questionId: string;
	optionId: number;
}