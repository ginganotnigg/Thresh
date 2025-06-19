import { scheduleJob, cancelJob } from "node-schedule";
import { AttemptTimeOutEvent } from "../../../domain/events/AttemptTimeOutEvent";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";

export class AttemptScheduleService {
	static scheduleAttempt(attemptId: string, endDate: Date) {
		const now = new Date();
		if (endDate <= now) {
			return;
		}
		scheduleJob(`attempt:${attemptId}`, endDate, async () => {
			EventDispatcher.getInstance().dispatch(new AttemptTimeOutEvent(attemptId));
		});
	}

	static cancelAttempt(attemptId: string) {
		cancelJob(`attempt:${attemptId}`);
	}
}
