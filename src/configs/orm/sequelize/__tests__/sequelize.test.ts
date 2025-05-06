import { prepareForTest } from "../prepare";
import sequelize from "../sequelize";

describe("Sequelize ORM", () => {
	it("should initialize the Sequelize instance", () => {
		expect(sequelize).toBeDefined();
	});

	it("should be able to seed the database", async () => {
		await prepareForTest();
	});
});