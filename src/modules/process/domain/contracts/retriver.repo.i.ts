export interface IRetriverRepository {
	getEndedDate(attemptId: number): Promise<Date>;
	getCalculatedTotalScore(attemptId: number): Promise<number>;
	getInProgressAttemptId(testId: number, candidateId: string): Promise<number | null>;
}