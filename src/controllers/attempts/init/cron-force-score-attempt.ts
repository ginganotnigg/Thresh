import cron from "node-cron";
import { db } from "../../../configs/orm/kysely/db";
import { AttemptRepo } from "../../../infrastructure/repo/AttemptRepo";

export async function scheduleForceScoreAttempt() {
	console.log("cronForceScoreAttempt started at", new Date().toISOString());

	cron.schedule("*/10 * * * *", async () => {
		try {
			await _scheduleForceScoreAttempt();
		} catch (err) {
			console.error("Error running cronForceScoreAttempt:", err);
		}
	}, {
		runOnInit: true, // Run immediately on startup
	});
}

async function _scheduleForceScoreAttempt() {
	console.log("cronForceScoreAttempt executed at", new Date().toISOString());
	const completedFor1HourAttempts = await db
		.selectFrom("Attempts")
		.where("status", "=", "COMPLETED")
		.where("createdAt", "<", new Date(Date.now() - 60 * 60 * 1000))
		.select(["id"])
		.execute()
		;
	const repo = new AttemptRepo();
	for (const attempt of completedFor1HourAttempts) {
		console.log("Force scored attempt:", attempt.id);
		const agg = await repo.getById(attempt.id);
		agg.forceScore();
		await repo.save(agg);
	}
}



