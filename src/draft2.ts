import { ensureDatabase } from "./configs/orm/database-operations";
import sequelize from "./configs/orm/sequelize/sequelize";
import Test from "./infrastructure/models/test";
import { TestAttemptsQueryRepo } from "./infrastructure/read/test-attemps.query-repo";

ensureDatabase()
	.then(async () => {
		await sequelize.sync({ logging: false });
		await sequelize.authenticate({ logging: false });
		const test = await Test.findByPk("787e3f6b-bbd0-4e17-b79c-d308f35d7e1c");
		if (!test) {
			throw new Error("Test not found");
		}
		const testAttemptsQueryRepo = new TestAttemptsQueryRepo(test);
		console.log(
			await testAttemptsQueryRepo.getParticipantsAggregate({
				page: 1,
				perPage: 10,
			}),
		);
	}).catch((err) => {
		console.error(err);
		console.error("Unable to start server, shutting down...");
		process.exit(1);
	}).finally(() => {
		sequelize.close();
		process.exit(0);
	});