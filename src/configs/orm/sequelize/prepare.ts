import { seed } from "../../../__init__/seed";
import { recreateDatabase } from "../database-operations";
import sequelize from "./sequelize";

export async function prepareForTest() {
	console.log("Preparing database for testing...");
	await recreateDatabase();
	await sequelize.sync({ logging: false, force: true });
	await sequelize.authenticate({ logging: false });
	await seed();
}