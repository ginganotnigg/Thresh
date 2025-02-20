export type AttemptModel = {
	ID: string;
	testId: string;
	candidateId: string;
	score: number;
	status: string;
	choices: number[];
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
}

export type QuestionModel = {
	ID: number;
	testId: number;
	text: string;
	options: string[];
	points: number;
	correctAnswer: number;
}