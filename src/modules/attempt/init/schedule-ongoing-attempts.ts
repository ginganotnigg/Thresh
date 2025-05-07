import Attempt from "../../../domain/models/attempt";
import Test from "../../../domain/models/test";
import { commandSubmitAttempt } from "../app/command/submit-attempt";
import { AttemptScheduleService } from "../services/attempt-schedule-service";

export async function scheduleOngoingAttempts() {
	const notEndedAttempts = await Attempt.findAll({
		where: {
			hasEnded: false,
		},
		include: [Test]
	});

	const now = new Date();
	for (const attempt of notEndedAttempts) {
		const endDate = new Date(attempt.createdAt.getTime() + (attempt.Test!.minutesToAnswer * 60 * 1000));
		if (endDate >= now) {
			await commandSubmitAttempt(attempt.id);
		}
		else {
			AttemptScheduleService.scheduleAttempt(attempt.id, endDate);
		}
	}

	console.log("Scheduled jobs created for not ended attempts.");
}
