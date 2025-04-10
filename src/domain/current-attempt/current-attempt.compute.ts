export class CurrentAttemptCompute {
	static getEndDate(attempt: { createdAt: Date; }, minutesToAnswer: number): Date {
		const endDate = new Date(attempt.createdAt.getTime() + minutesToAnswer * 60 * 1000);
		return endDate;
	}

	static getSecondsSpent(attempt: { createdAt: Date; }, minutesToAnswer: number): number {
		const now = new Date();
		if (now.getTime() < attempt.createdAt.getTime()) {
			throw new Error("Invalid time");
		}
		const endDate = CurrentAttemptCompute.getEndDate(attempt, minutesToAnswer);
		if (now.getTime() > endDate.getTime()) {
			return minutesToAnswer * 60;
		}
		const secondsSpent = Math.floor((now.getTime() - attempt.createdAt.getTime()) / 1000);
		return secondsSpent;
	}

	static getSecondsLeft(attempt: { createdAt: Date; }, minutesToAnswer: number): number {
		const now = new Date();
		const endDate = CurrentAttemptCompute.getEndDate(attempt, minutesToAnswer);
		const secondsLeft = Math.floor((endDate.getTime() - now.getTime()) / 1000);
		return secondsLeft < 0 ? 0 : secondsLeft;
	}
}