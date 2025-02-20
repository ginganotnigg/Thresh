export type AttemptModel = {
	ID: string;
	testId: string;
	candidateId: string;
	score: number;
	status: string;
	createdAt: Date;
	updatedAt: Date;
	Test: {
		ID: string;
		companyId: string;
		title: string;
		description: string;
		minutesToAnswer: number;
		difficulty: string;
		answerCount: string;
		createdAt: Date;
		updatedAt: Date;
	};
	AttemptQuestions: {
		ID: string;
		attemptId: string;
		questionId: string;
		chosenOption: number;
	}[];
}

export type QuestionModel = {
	ID: string;
	testId: string;
	text: string;
	options: string[];
	points: number;
	correctOption: number;
}