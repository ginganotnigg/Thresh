import { logTickError } from "../../../configs/logger/winston";
import { EventController } from "../controllers/event.controller";
import { AttemptTimeMemory } from "./attempt-time.memory";

// Todo: make global and handlers configurable

const tick = 1000; // Refresh every 1 second

export class TimerService {
	static init() {
		setInterval(() => {
			try {
				this.tick();
			} catch (error) {
				logTickError(error);
			}
		}, tick);
	}

	private static async tick() {
		const attemptTime = AttemptTimeMemory.instance().all();
		const promises = attemptTime.map(async (attempt) => {
			await this.syncTime(attempt.attemptId, attempt.endDate);
		});
		await Promise.all(promises);
	}

	private static async syncTime(attemptId: number, endDate: Date) {
		const now = new Date();
		const secondsLeft = Math.floor((endDate.getTime() - now.getTime()) / 1000);
		if (secondsLeft <= 0) {
			await EventController.timeUp(attemptId);
			EventController.synced(attemptId, 0);
		} else {
			EventController.synced(attemptId, secondsLeft);
		}
	}
}