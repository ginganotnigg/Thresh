import sequelize from "../configs/orm/sequelize";
import { load } from "./load";
async function seed() {
	console.log("Seeding database...");
	await sequelize.sync({
		force: true,
		logging: false
	});
	const data = await load();
	const query = sequelize.getQueryInterface();
	await query.bulkInsert("tags", data.tags, { logging: false });
	await query.bulkInsert("tests", data.tests, { logging: false });
	await query.bulkInsert("tests_has_tags", data.testsHasTags, { logging: false });
	await query.bulkInsert("questions", data.questions, { logging: false });
	await query.bulkInsert("attempts", data.attempts, { logging: false });
	await query.bulkInsert("attempts_answer_questions", data.attemptsAnswerQuestions, { logging: false });
	console.log("Database seed successfully");
};

export { seed };