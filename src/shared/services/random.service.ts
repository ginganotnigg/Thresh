import Test from "../../domain/models/test";
import schedule from "node-schedule"

export class RandomService {
	private static _todayRandomTestId: string | null = null;

	static async init() {
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
		if (testIds.length === 0) return null;
		const randomIndex = Math.floor(Math.random() * testIds.length);
		const randomId = testIds[randomIndex].id;
		this._todayRandomTestId = randomId;
	}

	static getTodayRandomTestId(): string | null {
		return this._todayRandomTestId;
	}
}