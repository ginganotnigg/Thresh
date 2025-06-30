import cron from "node-cron";
import { db } from "../../../configs/orm/kysely/db";
import { AttemptCreatedEvent } from "../../../domain/_events/AttemptCreatedEvent";
import { AttemptTimeOutEvent } from "../../../domain/_events/AttemptTimeOutEvent";
import { EventDispatcher } from "../../../shared/domain/EventDispatcher";

export async function scheduleOngoingAttempts() {
	console.log("scheduleOngoingAttempts started at", new Date().toISOString());

	cron.schedule("*/10 * * * *", async () => {
		try {
			await _scheduleOngoingAttempts();
		} catch (err) {
			console.error("Error running scheduleOngoingAttempts:", err);
		}
	}, {
		runOnInit: true, // Run immediately on startup
	});
}

async function _scheduleOngoingAttempts() {
	console.log("scheduleOngoingAttempts executed at", new Date().toISOString());
	const notEndedAttemptsOfTest = await db
		.selectFrom("Attempts")
		.where("status", "=", "IN_PROGRESS")
		.innerJoin("Tests", "Tests.id", "Attempts.testId")
		.selectAll(["Attempts", "Tests"])
		.select([
			"Attempts.createdAt as createdAt",
			"Attempts.id as id",
		])
		.execute()
		;

	const now = new Date();
	console.log("Ongoing attempts found:", notEndedAttemptsOfTest.length);

	for (const aot of notEndedAttemptsOfTest) {
		const endDate = new Date(aot.createdAt!.getTime() + (aot.minutesToAnswer * 60 * 1000));
		if (endDate <= now) {
			console.log(`Attempt ${aot.id} has timed out at ${now.toISOString()}`);
			EventDispatcher.getInstance().dispatch(new AttemptTimeOutEvent(aot.id));
		}
		else {
			console.log(`Attempt ${aot.id} is still ongoing, scheduled to end at ${endDate.toISOString()}`);
			EventDispatcher.getInstance().dispatch(new AttemptCreatedEvent(aot.id, endDate));
		}
	}
}



