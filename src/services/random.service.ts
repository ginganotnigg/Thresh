import Test from "../domain/models/test";
import schedule from "node-schedule"

export class RandomService {
	private static _todayRandomTestId: number | null = null;

	static async init() {
		if (this._todayRandomTestId !== null) {
			throw new Error("Random test ID already initialized. Call refreshRandomTestId() to refresh it.");
		}
		await this.refreshRandomTestId();
		// Schedule the job to run at midnight every day
		schedule.scheduleJob("0 0 * * *", () => {
			this.refreshRandomTestId().then(() => {
				console.log(`Random test ID refreshed to ${this._todayRandomTestId} at ${new Date()}`);
			}).catch((error) => {
				console.error("Error refreshing random test ID:", error);
			});
		});
	}

	private static async refreshRandomTestId() {
		const testIds = await Test.findAll({
			attributes: ["id"],
		});
		if (testIds.length === 0) throw new Error("No test available");
		const randomIndex = Math.floor(Math.random() * testIds.length);
		const randomId = testIds[randomIndex].id;
		this._todayRandomTestId = randomId;
	}

	static getTodayRandomTestId(): number {
		if (this._todayRandomTestId !== null) {
			return this._todayRandomTestId;
		}
		throw new Error("Random test ID not initialized. Call init() first.");
	}
}