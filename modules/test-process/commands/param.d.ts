export type StartNewAttemptParam = {
	testId: string;
	candidateId: string;
}

export type AnswerAttemptParam = {
	testId: string;
	candidateId: string;
	questionId: number;
	optionId: number;
}

export type SubmitAttemptParam = {
	testId: string;
	candidateId: string;
}
