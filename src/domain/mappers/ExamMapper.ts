export type ExamDto = {
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

export type ExamPersistence = {
	testId: string;
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

export class ExamMapper {
	static toDto(persistence: ExamPersistence): ExamDto {
		return persistence;
	}

	static toPersistence(dto: ExamDto, testId: string): ExamPersistence {
		return { ...dto, testId };
	}
}
