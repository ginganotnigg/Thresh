export interface TestProcessRequest {
	testId: number;
	candidateId: number;
}

export interface TestSubmitRequest {
	testId: number;
	answers: {
		questionId: number;
		optionId: number;
	}[];
}