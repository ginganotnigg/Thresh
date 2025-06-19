import { TestModeType } from "../../shared/enum";

type PracticeTestDto = {
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

export class TestMapper {
	static toDto(persistence: TestPersistence): TestDto {
		return persistence;
	}

	static toPersistence(dto: TestDto): TestPersistence {
		return dto;
	}
}