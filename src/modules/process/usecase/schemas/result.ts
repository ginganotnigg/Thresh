export type CurrentAttemptSmallResult = {
	id: number;
	startedAt: Date;
	endedAt: Date;
}

export type CurrentAttemptDetailResult = {
	id: number;
	test: {
		id: number;
		managerId: string;
		title: string;
		description: string;
		minutesToAnswer: number;
		difficulty: string;
		createdAt: Date;
		updatedAt: Date;
	};
	questions: {
		id: number;
		text: string;
		options: {
			id: number;
			text: string;
		}[];
		points: number;
		chosenOption: number;
	}[];
	startedAt: Date;
	endedAt: Date;
}