import "reflect-metadata";
import { config } from "dotenv";
config();
import syncSequelize from "./configs/sequelize/init";
import { configApplication } from "./app/server";

const PORT = process.env.PORT || 8080;

Promise.allSettled([
	syncSequelize()
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
