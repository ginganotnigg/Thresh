import { cancelJob, scheduleJob } from "node-schedule";
import commandEndAttempt from "../app/command/end-attempt";

export class AttemptScheduleService {
	static scheduleAttempt(attemptId: string, endDate: Date) {
		const now = new Date();
		if (endDate <= now) {
			return;
		}
		scheduleJob(`attempt:${attemptId}`, endDate, async () => {
			await commandEndAttempt({ attemptId });
		});
	}

	static cancelAttempt(attemptId: string) {
		cancelJob(`attempt:${attemptId}`);
	}
}