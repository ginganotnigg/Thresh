import { seed } from "../__init__/seed";
import sequelize from "../configs/orm/sequelize";

export async function setupBeforeAll() {
	await seed();
}

export async function setupAfterAll() {
	await sequelize.close();
}