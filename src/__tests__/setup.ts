import sequelize from "../configs/orm/sequelize/sequelize";
import { prepareForTest } from "../configs/orm/sequelize/prepare";

export async function setupBeforeAll() {
	try {
		await prepareForTest();
	} catch (error) {
		console.error("Unable to connect to the database:", error);
		throw error;
	}
}

export async function setupAfterAll() {
	await sequelize.close();
}