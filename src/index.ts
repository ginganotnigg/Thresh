import "reflect-metadata";
import { env } from "./app/env"; // On top of all others imports
import { configApplication } from "./app/server";
import sequelize from "./configs/orm/sequelize";

Promise.allSettled([
	sequelize.sync({ logging: false }),
	sequelize.authenticate({ logging: false }),
]).then(async () => {
	const { server } = await configApplication();
	server.listen(env.port, () => {
		console.log(`Server running on port: ${env.port}`);
	});
}).catch((err) => {
	console.error(err);
	console.error("Unable to start server, shutting down...");
	process.exit(1);
});
