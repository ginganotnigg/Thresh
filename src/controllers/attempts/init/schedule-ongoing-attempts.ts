import { db } from "../../../configs/orm/kysely/db";
import { AttemptCreatedEvent } from "../../../domain/_events/AttemptCreatedEvent";
import { AttemptTimeOutEvent } from "../../../domain/_events/AttemptTimeOutEvent";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";

export async function scheduleOngoingAttempts() {
	const notEndedAttemptsOfTest = await db
		.selectFrom("Attempts")
		.where("status", "=", "IN_PROGRESS")
		.innerJoin("Tests", "Tests.id", "Attempts.testId")
		.selectAll()
		.select([
			"Attempts.createdAt as createdAt",
			"Attempts.id as id",
		])
		.execute();
	;

	const now = new Date();
	for (const aot of notEndedAttemptsOfTest) {
		const endDate = new Date(aot.createdAt!.getTime() + (aot.minutesToAnswer * 60 * 1000));
		if (endDate <= now) {
			EventDispatcher.getInstance().dispatch(new AttemptTimeOutEvent(aot.id));
		}
		else {
			EventDispatcher.getInstance().dispatch(new AttemptCreatedEvent(aot.id, endDate));
		}
	}
}
