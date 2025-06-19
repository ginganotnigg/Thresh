import { scheduleJob, cancelJob } from "node-schedule";

export class AttemptScheduleService {
	static scheduleAttempt(attemptId: string, endDate: Date) {
		const now = new Date();
		if (endDate <= now) {
			return;
		}
		scheduleJob(`attempt:${attemptId}`, endDate, async () => {
			await (await AttemptRepo.load(attemptId)).submit();
		});
	}

	static cancelAttempt(attemptId: string) {
		cancelJob(`attempt:${attemptId}`);
	}
}
