import { INotify } from "../../domain/contracts/notify.i";

export class NotifySocket implements INotify {
	constructor(
	) { }
	sendEvaluated(attemptId: number): void {
		throw new Error("Method not implemented.");
	}
	sendSynced(attemptId: number, timeLeft: number): void {
		throw new Error("Method not implemented.");
	}
	sendAnswered(attemptId: number, questionId: number, optionId?: number): void {
		throw new Error("Method not implemented.");
	}
}