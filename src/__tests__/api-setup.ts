import { seed } from "../__init__/seed";
import sequelize from "../configs/orm/sequelize";
import { configServer } from "../app/configServer";

export async function setupBeforeAll() {
	// Seed data
	await seed();

	// Config application
	const { app } = await configServer();
	return app;
}

export async function setupAfterAll() {
	// Close connection
	await sequelize.close();
}