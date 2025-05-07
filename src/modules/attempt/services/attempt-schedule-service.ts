import { cancelJob, scheduleJob } from "node-schedule";
import { commandSubmitAttempt } from "../app/command/submit-attempt";

export class AttemptScheduleService {
	static scheduleAttempt(attemptId: string, endDate: Date) {
		const now = new Date();
		if (endDate <= now) {
			return;
		}
		scheduleJob(`attempt:${attemptId}`, endDate, async () => {
			await commandSubmitAttempt(attemptId);
		});
	}

	static cancelAttempt(attemptId: string) {
		cancelJob(`attempt:${attemptId}`);
	}
}