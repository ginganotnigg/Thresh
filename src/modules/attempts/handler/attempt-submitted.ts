import Attempt from "../../../domain/models/attempt";
import { attemptEmitter } from "../init/emitter";
import { AttemptScheduleService } from "../services/attempt-schedule-service";

attemptEmitter.on("ATTEMPT_SUBMITTED", async (attemptId) => {
	const attempt = await Attempt.findByPk(attemptId);
	if (!attempt) {
		throw new Error("Attempt not found");
	}
	AttemptScheduleService.cancelAttempt(attempt.id);
});