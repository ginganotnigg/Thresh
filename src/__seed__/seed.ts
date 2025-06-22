import { recreateDatabase } from "../configs/orm/database-operations";
import sequelize from "../configs/orm/sequelize/sequelize";

export async function seed() {
	if (
		process.env.NODE_ENV !== "test" &&
		process.env.NODE_ENV !== "development" &&
		process.env.NODE_ENV !== "staging"
	) {
		throw new Error("Seeding is only allowed in test environment");
	}

	try {
		await recreateDatabase();
		await sequelize.sync({ logging: true, force: true });
		await sequelize.authenticate({ logging: false });

		console.log("Seeding database...");
		const query = sequelize.getQueryInterface();

		// Example seed data for Users table

		console.log("Seeding completed.");
	} catch (error) {
		console.error("Error seeding database:", error);
		throw error; // Rethrow the error to be handled by the caller
	}
}
