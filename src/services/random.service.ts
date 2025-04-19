import Test from "../domain/models/test";

export class RandomService {
	private static _todayRandomTestId: number | null = null;

	static async init() {
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