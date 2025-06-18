import { QuestionTypeType } from "../../../../domain/enum";

export type QuestionDto = {
	id: number;
	text: string;
	type: QuestionTypeType;
};


export type QuestionPersistence = {
	id: number;
	question: string;
	type: QuestionTypeType;
};
