export type AnswerDto = ({
}) & ({
	type: "MCQ";
	chosenOption: number;
} | {
	type: "LONG_ANSWER";
	answer: string;
});

export type AnswerPersistence = {
	questionId: number;
	attemptId: string;
} & ({
	type: "CLEAR_ANSWER";
} | {
	type: "MCQ";
	chosenOption: number; 	// Only for MCQ
} | {
	type: "LONG_ANSWER";
	answer: string; 	// Only for LONG_ANSWER
});

export class AnswerMapper {
	static toPersistence({
		questionId,
		attemptId,
		answer,
	}: {
		questionId: number;
		attemptId: string;
		answer: AnswerDto | null;
	}): AnswerPersistence {
		if (answer === null) {
			return {
				questionId,
				attemptId,
				type: "CLEAR_ANSWER",
			};
		}
		if (answer.type === "MCQ") {
			return {
				questionId,
				attemptId,
				type: "MCQ",
				chosenOption: answer.chosenOption,
			};
		} else if (answer.type === "LONG_ANSWER") {
			return {
				questionId,
				attemptId,
				type: "LONG_ANSWER",
				answer: answer.answer,
			};
		}
		throw new Error("Invalid answer type");
	}
}