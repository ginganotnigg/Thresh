import { QuestionLoad } from "./QuestionMapper";

export type AnswerDto = {
	pointsReceived?: number | null;
} & ({
	type: "MCQ";
	chosenOption: number;
} | {
	type: "LONG_ANSWER";
	answer: string;
});

export type AnswerPersistence = {
	id: string;
	questionId: number;
	attemptId: string;
} & ({
	type: "CLEAR_ANSWER";
} | {
	type: "MCQ";
	chosenOption: number;
	pointsReceived: number | null;
} | {
	type: "LONG_ANSWER";
	answer: string;
	pointsReceived: number | null;
});

export type AnswerLoad = {
	id: string;
	attemptId: string;
	question: QuestionLoad;
	pointsReceived: number | null;
} & ({
	type: "MCQ";
	chosenOption: number;
} | {
	type: "LONG_ANSWER";
	answer: string;
});

export class AnswerMapper {
	static toDeletePersistence(id: string, attemptId: string, questionId: number): AnswerPersistence {
		return {
			id,
			questionId,
			attemptId,
			type: "CLEAR_ANSWER",
		};
	}

	static toPersistence(id: string, attemptId: string, questionId: number, answer: AnswerDto): AnswerPersistence {
		return {
			id,
			questionId,
			attemptId,
			...answer,
			pointsReceived: answer.pointsReceived ?? null,
		};
	}

	static toDto(load: AnswerLoad): AnswerDto {
		const { question, ...answer } = load;
		return {
			...answer,
		};
	}
}