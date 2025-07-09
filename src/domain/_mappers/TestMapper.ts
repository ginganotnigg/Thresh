import { TestModeType } from "../../shared/enum";

export type PracticeTestDto = {
	mode: "PRACTICE";
	difficulty: string;
	numberOfOptions: number;
	numberOfQuestions: number;
	outlines: string[];
	tags: string[];
}

type ExamTestDto = {
	mode: "EXAM";
	roomId: string;
	openDate: Date;
	closeDate: Date;
	numberOfAttemptsAllowed: number;
	numberOfParticipants: number;
	isPublic: boolean;
	isAnswerVisible: boolean;
	isAllowedToSeeOtherResults: boolean;
	password?: string | null;
}


export type TestDto = {
	title: string;
	description: string;
	minutesToAnswer: number;
	language: string;
	authorId: string;
	mode: TestModeType;
} & {
	detail: PracticeTestDto | ExamTestDto;
};


type PracticeTestPersistence = {
	mode: "PRACTICE";
	difficulty: string;
	numberOfOptions: number;
	numberOfQuestions: number;
	outlines: string[];
	tags: string[];
}

type ExamTestPersistence = {
	mode: "EXAM";
	roomId: string;
	openDate: Date;
	closeDate: Date;
	numberOfAttemptsAllowed: number;
	numberOfParticipants: number;
	isPublic: boolean;
	isAnswerVisible: boolean;
	isAllowedToSeeOtherResults: boolean;
	password?: string | null;
}

export type TestPersistence = {
	id: string;
	title: string;
	description: string;
	minutesToAnswer: number;
	language: string;
	authorId: string;
	mode: TestModeType;
	createdAt?: Date;
	updatedAt?: Date;
} & {
	detail: PracticeTestPersistence | ExamTestPersistence;
}

export type TestLoad = TestPersistence & {
	hasAttempts: boolean;
	hasParticipants: boolean;
}

export class TestMapper {
	static toDto(persistence: TestLoad): TestDto {
		return persistence;
	}

	static toPersistence(
		dto: TestDto,
		id: string,
	): TestPersistence {
		return {
			...dto,
			id,
			detail: {
				...dto.detail,
			} as PracticeTestPersistence | ExamTestPersistence
		};
	}
}

