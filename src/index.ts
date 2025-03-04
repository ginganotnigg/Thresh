import "reflect-metadata";
import { config } from "dotenv";
config();
import { configApplication } from "./app/server";
import sequelize from "./configs/orm/sequelize";

const PORT = process.env.PORT || 8080;

Promise.allSettled([
	sequelize.sync({ logging: false }),
	sequelize.authenticate({ logging: false }),
]).then(async () => {
	const server = await configApplication();
	server.listen(PORT, () => {
		console.log(`Server running on port: ${PORT}`);
	});
}).catch((err) => {
	console.error(err);
	console.error("Unable to start server, shutting down...");
	process.exit(1);
});
