export interface INotify {
	sendEvaluated(attemptId: number): void;
	sendSynced(attemptId: number, timeLeft: number): void;
	sendAnswered(attemptId: number, questionId: number, optionId?: number): void;
}