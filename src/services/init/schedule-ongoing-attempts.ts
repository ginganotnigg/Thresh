import Attempt from "../../infrastructure/models/attempt";
import Test from "../../infrastructure/models/test";
import { AttemptScheduleService } from "../../domain/service/AttemptScheduleService";
import { PatchAttemptSubmitHandler } from "../../controllers/attempts/uc_command/patch-attempt-submit/handler";

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
		if (endDate <= now) {
			await new PatchAttemptSubmitHandler()
				.withCredentials({
					userId: attempt.candidateId,
					role: "CANDIDATE",
				})
				.withId(attempt.id)
				.handle();
		}
		else {
			AttemptScheduleService.scheduleAttempt(attempt.id, endDate);
		}
	}
}
