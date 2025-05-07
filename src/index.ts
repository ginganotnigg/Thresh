import "reflect-metadata";
import { main } from "./app/main";
import sequelize from "./configs/orm/sequelize/sequelize";
import { appServices } from "./app/services";
import { env } from "./configs/env";
import { ensureDatabase, recreateDatabase } from "./configs/orm/database-operations";

ensureDatabase()
	.then(async () => {
		if (env.resetDatabase === true) {
			await recreateDatabase();
		}
		await sequelize.sync({ logging: false });
		await sequelize.authenticate({ logging: false });
		await appServices();
		await main();
	}).catch((err) => {
		console.error(err);
		console.error("Unable to start server, shutting down...");
		process.exit(1);
	});