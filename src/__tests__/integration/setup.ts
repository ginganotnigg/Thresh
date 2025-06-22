import sequelize from "../../configs/orm/sequelize/sequelize";
import { seed } from "../../__seed__/seed";

export async function setupBeforeAll() {
	await seed();
}

export async function setupAfterAll() {
	await sequelize.close();
}