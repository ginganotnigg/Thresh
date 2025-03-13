import { seed } from "../__init__/seed";
import { configApplication } from "../app/server";
import sequelize from "../configs/orm/sequelize";

export async function setupBeforeAll() {
	// Seed data
	await seed();

	// Config application
	const { app } = await configApplication();
	return app;
}

export async function setupAfterAll() {
	// Close connection
	await sequelize.close();
}