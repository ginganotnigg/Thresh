import { seed } from "../__init__/seed";
import sequelize, { syncSequelizeForce } from "../configs/orm/sequelize";
import { configServer } from "../app/configServer";

export async function getApp() {
	const { app } = await configServer();
	return app;
}

export async function setupBeforeAll() {
	await syncSequelizeForce();
}

export async function setupAfterAll() {
	await sequelize.close();
}