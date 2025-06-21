import "reflect-metadata";
import { main } from "./app/main";
import { ensureDatabase } from "./configs/orm/database-operations";

ensureDatabase()
	.then(async () => {
		await main();
	}).catch((err) => {
		console.error(err);
		console.error("Unable to start server, shutting down...");
		process.exit(1);
	});