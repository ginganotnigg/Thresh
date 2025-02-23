export interface IWriteRepository {
	createNewAttemptForCandidate(testId: number, candidateId: string): Promise<void>;
	submitAttemptScore(attemptId: number, totalScore: number): Promise<void>;
	submitAttemptScore(attemptId: number, score: number): Promise<void>;
	answerOnAttempt(attemptId: number, questionId: number, optionId?: number): Promise<void>;
}