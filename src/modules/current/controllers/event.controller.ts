import { AttemptTime, AttemptTimeMemory } from "../services/attempt-time.memory";
import { NotifyService } from "../services/notify.service";
import { ProcessCommandService } from "../services/command.service";
import { ProcessQueryService } from "../services/query.service";

export class EventController {
	static ended(attemptId: number) {
		NotifyService.notify().ended(attemptId);
	}

	static synced(attemptId: number, secondsLeft: number) {
		NotifyService.notify().synced(attemptId, secondsLeft);
	}

	static answered(attemptId: number, questionId: number, optionId?: number) {
		NotifyService.notify().answered(attemptId, questionId, optionId);
	}

	static async started(attemptId: number) {
		const attempt = await ProcessQueryService.getInProgressAttemptSmallById(attemptId);
		AttemptTimeMemory.instance().addProgress(new AttemptTime(attempt.id, attempt.endedAt));
	}

	static async timeUp(attemptId: number) {
		await ProcessCommandService.evaluateAttempt(attemptId);
	}
}