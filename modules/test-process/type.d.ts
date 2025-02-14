import { Test } from "../../types/model";

export interface TestProcess {
	test: Omit<Test, "answerCount">;
	questions: {
		ID: number;
		text: string;
		options: {
			ID: number;
			text: string;
		}[];
		points: number;
		chosenOption: number | null;
	}[];
}

export interface Option {
	questionID: number;
	optionID: number;
}