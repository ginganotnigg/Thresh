export type CurrentAttemptDetailCast = {
	ID: string;
	testId: string;
	candidateId: string;
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
		createdAt: Date;
		updatedAt: Date;
	};
	AttemptQuestions: {
		ID: number;
		questionId: number;
		chosenOption: number;
		Question: {
			ID: number;
			text: string;
			points: number;
			options: string[];
		}
	}[];
}