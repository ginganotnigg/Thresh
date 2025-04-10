import sequelize from "../configs/orm/sequelize";
import { load } from "./load";

// FUCK MYSQL
// https://stackoverflow.com/questions/6134006/are-table-names-in-mysql-case-sensitive

async function seed() {
	console.log("Seeding database...");
	await sequelize.sync({
		force: true,
		logging: false,
	});
	const data = await load();
	const query = sequelize.getQueryInterface();
	await query.bulkInsert("Tags", data.tags, { logging: false });
	await query.bulkInsert("Tests", data.tests, { logging: false });
	await query.bulkInsert("Tests_has_Tags", data.testsHasTags, { logging: false });
	await query.bulkInsert("Questions", data.questions, { logging: false });
	await query.bulkInsert("Attempts", data.attempts, { logging: false });
	await query.bulkInsert("Attempts_answer_Questions", data.attemptsAnswerQuestions, { logging: false });
	console.log("Database seed successfully");
};

export { seed };