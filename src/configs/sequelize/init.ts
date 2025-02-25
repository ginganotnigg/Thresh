import config from "./association";
import sequelize from "./database";
import data from "../../__tests__/data";

export default async function syncSequelize(useSampleData: boolean = false) {
	config(sequelize);
	try {
		// Setup test data
		if (useSampleData) {
			await sequelize.sync({
				force: useSampleData,
				logging: false
			});
			const query = sequelize.getQueryInterface();
			await query.bulkInsert("tags", data.tags, { logging: false });
			await query.bulkInsert("tests", data.tests, { logging: false });
			await query.bulkInsert("tests_has_tags", data.testsHasTags, { logging: false });
			await query.bulkInsert("questions", data.questions, { logging: false });
			await query.bulkInsert("attempts", data.attempts, { logging: false });
			await query.bulkInsert("attempts_answer_questions", data.attemptsAnswerQuestions, { logging: false });
			console.log("Database reset successfully");
		}
		// Sync database normally
		else {
			sequelize.sync({ logging: false });
		}
	} catch (err: any) {
		console.log("Sync failed: ", err);
	}
};