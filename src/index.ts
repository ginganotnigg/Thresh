import "reflect-metadata";
import { main } from "./app/main";
import sequelize from "./configs/orm/sequelize/sequelize";
import { appServices } from "./app/services";
import { env } from "./configs/env";
import { ensureDatabase } from "./configs/orm/database-operations";
import { seed } from "./__scripts__/seed";
import { MessageBrokerService } from "./services/MessageBrokerService";

ensureDatabase()
	.then(async () => {
		if (env.seedDatabase === true) {
			await seed();
		} else {
			await sequelize.sync({ logging: false });
			await sequelize.authenticate({ logging: false });
		}
		await appServices();
		await main();
		process.on("beforeExit", async (ev) => {
			await MessageBrokerService.close();
		});
	}).catch((err) => {
		console.error(err);
		console.error("Unable to start server, shutting down...");
		process.exit(1);
	});