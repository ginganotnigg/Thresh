import { ScheduleService } from "./schedule.service";
import { ProcessQueryService } from "./query.service";

export class AttemptTime {
	constructor(
		public readonly attemptId: number,
		public readonly endDate: Date
	) { }

	timeLeft() {
		const now = new Date();
		return this.endDate.getTime() - now.getTime();
	}
}

export class AttemptTimeMemory {
	private static _instance?: AttemptTimeMemory;

	static instance() {
		if (!this._instance) {
			throw new Error('AttemptTimeMemory not initialized');
		}
		return this._instance
	}

	static async init() {
		if (this._instance) {
			throw new Error('AttemptTimeMemory already initialized');
		}
		const attempts = await ProcessQueryService.getAllInProgress();
		this._instance = new AttemptTimeMemory(attempts.map(attempt => new AttemptTime(
			attempt.id,
			attempt.endedAt
		)));
	}

	private constructor(attemptTimes: AttemptTime[]) {
		this.inprogresses = [];
		attemptTimes.forEach(attemptTime => {
			this.addProgress(attemptTime);
		});
	}

	private inprogresses: AttemptTime[];

	addProgress(attemptTime: AttemptTime) {
		this.inprogresses.push(attemptTime);
		ScheduleService.scheduleAttemptEvaluation(attemptTime.attemptId, attemptTime.endDate);
	}

	all() {
		return [...this.inprogresses];
	}
}