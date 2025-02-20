export type CurrentAttemptSmallResult = {
	ID: string;
	startedAt: Date;
	endedAt: Date;
}

export type CurrentAttemptDetailResult = {
	ID: string;
	test: {
		ID: string;
		companyId: string;
		title: string;
		description: string;
		minutesToAnswer: number;
		difficulty: string;
		createdAt: Date;
		updatedAt: Date;
	};
	questions: {
		ID: number;
		text: string;
		options: {
			ID: number;
			text: string;
		}[];
		points: number;
		chosenOption: number;
	}[];
	startedAt: Date;
	endedAt: Date;
}