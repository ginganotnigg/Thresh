import { QuestionTypeType } from "../../shared/enum";

type MCQQuestionDto = {
	type: "MCQ";
	correctOption: number;
	options: string[];
};

type LongAnswerQuestionDto = {
	type: "LONG_ANSWER";
	correctAnswer: string;
	extraText?: string | null | undefined;
	imageLinks?: string[] | null | undefined;
};

export type QuestionDto = {
	text: string;
	points: number;
	type: QuestionTypeType;
} & {
	detail: MCQQuestionDto | LongAnswerQuestionDto;
};

export type QuestionPersistence = {
	id: number;
	testId: string;
	points: number;
	text: string;
	type: QuestionTypeType;
} & {
	detail: MCQQuestionDto | LongAnswerQuestionDto;
}

export class QuestionMapper {
	static toDto(persistence: QuestionPersistence): QuestionDto {
		return {
			text: persistence.text,
			type: persistence.type,
			detail: persistence.detail,
			points: persistence.points,
		};
	}

	static toPersistence(dto: QuestionDto, id: number, testId: string): QuestionPersistence {
		return {
			id,
			testId,
			text: dto.text,
			type: dto.type,
			detail: dto.detail,
			points: dto.points,
		};
	}
}