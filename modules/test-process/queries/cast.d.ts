export type CurrentAttemptDetailCast = {
	ID: string;
	testId: string;
	candidateId: string;
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
		createdAt: Date;
		updatedAt: Date;
		Questions: {
			ID: number;
			testId: string;
			text: string;
			options: string[];
			points: number;
		}[];
	};
}