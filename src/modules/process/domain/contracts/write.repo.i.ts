export interface IWriteRepository {
	createNewAttemptForCandidate(testId: number, candidateId: string): Promise<void>;
	submitAttempt(attemptId: number): Promise<void>;
	answerOnAttempt(attemptId: number, questionId: number, optionId?: number): Promise<void>;
}