export interface CurrentAttemptResponse {
	ID: string;
	score: number | null;
	status: string;
	createdAt: string;
	endDate: string;
}

export interface CurrentAttemptDetailResponse {
	ID: string;
	test: {
		ID?: number;
		companyId: string;
		title: string;
		description: string;
		minutesToAnswer: number;
		difficulty?: string;
		createdAt?: Date;
		updatedAt?: Date;
	};
	questions: {
		ID: number;
		text: string;
		options: {
			ID: number;
			text: string;
		}[];
		points: number;
	}[];
	startedAt: Date;
	endedAt: Date;
}