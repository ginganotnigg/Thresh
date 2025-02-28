import { EventController } from "../controllers/event.controller";
import { AttemptTimeMemory } from "./attempt-time.memory";

// Todo: make global and handlers configurable

const tick = 1000; // 1 second

export class TimerController {
	static init() {
		setInterval(() => {
			this.tick();
		}, tick);
	}

	private static tick() {
		console.log('tick');
		// Do something
		const attemptTime = AttemptTimeMemory.instance().all();
		attemptTime.forEach(attempt => {
			this.syncTime(attempt.attemptId, attempt.endDate);
		});
	}

	private static async syncTime(attemptId: number, endDate: Date) {
		const now = new Date();
		const timeLeft = Math.floor((endDate.getTime() - now.getTime()) / 1000);
		if (timeLeft <= 0) {
			await EventController.timeUp(attemptId);
			EventController.synced(attemptId, 0);
		} else {
			EventController.synced(attemptId, timeLeft);
		}
	}
}