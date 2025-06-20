import { AttemptCreatedEvent } from "../../../domain/_events/AttemptCreatedEvent";
import { AttemptTimeOutEvent } from "../../../domain/_events/AttemptTimeOutEvent";
import Attempt from "../../../infrastructure/models/attempt";
import Test from "../../../infrastructure/models/test";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";

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
			EventDispatcher.getInstance().dispatch(new AttemptTimeOutEvent(attempt.id));
		}
		else {
			EventDispatcher.getInstance().dispatch(new AttemptCreatedEvent(attempt.id, endDate));
		}
	}
}
