import "reflect-metadata";
import { configServer } from "./app/configServer";
import sequelize from "./configs/orm/sequelize";
import { configServices } from "./app/configServices";
import ensureDatabase from "./configs/orm/ensure-database";
import { env } from "./utils/env";
import { seed } from "./__init__/seed";
import recreateDatabase from "./configs/orm/recreate-database";

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