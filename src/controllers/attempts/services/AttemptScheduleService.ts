import { scheduleJob, cancelJob } from "node-schedule";
import { AttemptTimeOutEvent } from "../../../domain/events/AttemptTimeOutEvent";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";

export class AttemptScheduleService {
	private static currentAttemptScheduleJobs: Set<string> = new Set();
	private static toJobId = (attemptId: string): string => `attempt:${attemptId}`;

	static scheduleAttempt(attemptId: string, endDate: Date) {
		const now = new Date();
		if (endDate <= now) {
			EventDispatcher.getInstance().dispatch(new AttemptTimeOutEvent(attemptId));
		}
		else {
			if (this.currentAttemptScheduleJobs.has(attemptId)) {
				// If the job is already scheduled, we can cancel it first
				this.cancelAttempt(attemptId);
			}
			this.currentAttemptScheduleJobs.add(attemptId);
			scheduleJob(this.toJobId(attemptId), endDate, async () => {
				EventDispatcher.getInstance().dispatch(new AttemptTimeOutEvent(attemptId));
			});
		}
	}

	static cancelAttempt(attemptId: string) {
		cancelJob(this.toJobId(attemptId));
		this.currentAttemptScheduleJobs.delete(attemptId);
	}
}
