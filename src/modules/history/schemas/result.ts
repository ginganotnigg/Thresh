export type AttemptItemResult = {
	id: number;
	test: {
		id: number;
		managerId: string;
		title: string;
		minutesToAnswer: number;
		tags: string[];
	}
	candidateId: string;
	startDate: Date;
	timeSpent: number;
	score: number;
}

export type AttemptResult = AttemptItemResult & {
	totalCorrectAnswers: number;
	totalWrongAnswers: number;
	totalQuestions: number;
}

export type AnswerQuestionResult = {
	question: {
		id: number;
		text: string;
		options: string[];
		points: number;
		correctOption: number;
	}
	chosenOption: number;
}
