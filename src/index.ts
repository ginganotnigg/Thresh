import "reflect-metadata";
import { env } from "./app/env";
import { configApplication } from "./app/server";
import sequelize from "./configs/orm/sequelize";

Promise.allSettled([
	sequelize.sync({ logging: false }),
	sequelize.authenticate({ logging: false }),
]).then(async () => {
	await configApplication();
}).catch((err) => {
	console.error(err);
	console.error("Unable to start server, shutting down...");
	process.exit(1);
});
