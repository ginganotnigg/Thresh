import "reflect-metadata";
import { configServer } from "./app/configServer";
import sequelize from "./configs/orm/sequelize/sequelize";
import { configServices } from "./app/configServices";
import { env } from "./utils/env";
import { ensureDatabase, recreateDatabase } from "./configs/orm/database-operations";

ensureDatabase()
	.then(async () => {
		if (env.resetDatabase === true) {
			await recreateDatabase();
		}
		await sequelize.sync({ logging: false });
		await sequelize.authenticate({ logging: false });
		await configServices();
		await configServer();
	}).catch((err) => {
		console.error(err);
		console.error("Unable to start server, shutting down...");
		process.exit(1);
	});