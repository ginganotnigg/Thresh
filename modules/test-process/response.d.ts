import { Test } from "../../types/model";

export interface TestProcessResponse {
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