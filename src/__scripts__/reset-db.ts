import { recreateDatabase } from "../configs/orm/database-operations";
import sequelize from "../configs/orm/sequelize/sequelize";

recreateDatabase()
	.then(async () => {
		await sequelize.sync({ logging: false });
		await sequelize.authenticate({ logging: false });
	}).catch((err) => {
		console.error(err);
		console.error("Unable to start server, shutting down...");
		process.exit(1);
	}).finally(() => {
		sequelize.close();
		process.exit(0);
	});