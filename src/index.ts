import "reflect-metadata";
import { configServer } from "./app/configServer";
import sequelize from "./configs/orm/sequelize";
import { configServices } from "./app/configServices";
import ensureDatabase from "./configs/orm/ensure-database";

ensureDatabase().then(() => {
	Promise.allSettled([
		sequelize.sync({ logging: false }),
		sequelize.authenticate({ logging: false }),
	]).then(async () => {
		await configServices();
		await configServer();
	})
}).catch((err) => {
	console.error(err);
	console.error("Unable to start server, shutting down...");
	process.exit(1);
});