export interface Attempt {
	ID?: number;
	testId: number;
	candidateId: string;
	score: number;
	status: string;
	choices: number[];
	createdAt: Date;
	updatedAt?: Date;
}

export interface Question {
	ID?: number;
	testId: number;
	text: string;
	options: string[];
	points: number;
	correctAnswer: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface Test {
	ID?: number;
	companyId: string;
	title: string;
	description: string;
	minutesToAnswer: number;
	difficulty?: string;
	answerCount: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface Tag {
	ID?: number;
	name: string;
}
