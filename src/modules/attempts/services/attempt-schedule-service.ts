import { cancelJob, scheduleJob } from "node-schedule";
import { AttemptRepo } from "../../../domain/repo/attempt/attempt.repo";

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