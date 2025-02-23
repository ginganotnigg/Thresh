import { AttemptStatus } from "../../../common/domain/enum";

export type TestItemResult = {
	id: number;
	companyId: string;
	title: string;
	difficulty: string;
	minutesToAnswer: number;
	tags: string[];
	answerCount: number;
	createdAt: Date;
	updatedAt: Date;
}

export type TestResult = {
	id: number;
	companyId: string;
	title: string;
	description: string;
	difficulty: string;
	minutesToAnswer: number;
	answerCount: number;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

export type QuestionResult = {
	id: number;
	text: string;
	options: string[];
	points: number;
	correctOption: number;
}

export type AttemptResult = {
	id: number;
	testId: number;
	candidateId: string;
	score: number;
	status: AttemptStatus;
	answerQuestions: QuestionResult & { chosenOption: number }[];
	createdAt: Date;
	updatedAt: Date;
}