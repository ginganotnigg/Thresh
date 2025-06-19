import { QuestionTypeType } from "../../shared/enum";

type MCQQuestionDto = {
	type: "MCQ";
	correctOption: number;
	options: string[];
};
type LongAnswerQuestionDto = {
	type: "LONG_ANSWER";
	correctAnswer: string;
	extraText?: string;
	imageLinks?: string[];
};

export type QuestionDto = {
	id: number;
	text: string;
	type: QuestionTypeType;
} & {
	detail: MCQQuestionDto | LongAnswerQuestionDto;
};

export type QuestionPersistence = {
	id: number;
	testId: string;
	text: string;
	type: QuestionTypeType;
} & {
	detail: MCQQuestionDto | LongAnswerQuestionDto;
}

export class QuestionMapper {
	static toDto(persistence: QuestionPersistence): QuestionDto {
		return {
			id: persistence.id,
			text: persistence.text,
			type: persistence.type,
			detail: persistence.detail,
		};
	}

	static toPersistence(dto: QuestionDto, testId: string): QuestionPersistence {
		return {
			id: dto.id,
			text: dto.text,
			type: dto.type,
			testId: testId,
			detail: dto.detail,
		};
	}
}