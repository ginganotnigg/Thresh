import Attempt from "../../../infrastructure/models/attempt";
import Test from "../../../infrastructure/models/test";
import { attemptEmitter } from "../init/emitter";
import { AttemptScheduleService } from "../services/attempt-schedule-service";

attemptEmitter.addListener("ATTEMPT_CREATED", async (attemptId) => {
	const attempt = await Attempt.findByPk(attemptId, {
		include: [Test],
	});
	if (!attempt) {
		throw new Error("Attempt not found");
	}
	const endDate = new Date(attempt.createdAt.getTime() + (attempt.Test!.minutesToAnswer * 60 * 1000));
	if (endDate >= new Date()) {
		return;
	}
	AttemptScheduleService.scheduleAttempt(attempt.id, endDate);
});