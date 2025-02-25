import { AttemptStatus } from "../../../common/domain/enum";

export type TestItemResult = Omit<TestResult, 'description'> & { answerCount: number };

export type TestResult = {
	id: number;
	managerId: string;
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