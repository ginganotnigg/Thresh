import sequelize from "../configs/orm/sequelize/sequelize";
import attempts from "./data/attempts";
import attemptsAnswerQuestions from "./data/attempts_answer_questions";
import examTests from "./data/exam_tests";
import practiceTests from "./data/practice_tests";
import questions from "./data/questions";
import tests from "./data/tests";
import users from "./data/users";

export async function seed() {
	try {
		console.log("Seeding database...");
		const query = sequelize.getQueryInterface();
		await query.bulkInsert("Users", users, { logging: false });
		await query.bulkInsert("Tests", tests, { logging: false });
		await query.bulkInsert("Questions", questions, { logging: false });
		await query.bulkInsert("Attempts", attempts, { logging: false });
		await query.bulkInsert("Attempts_answer_Questions", attemptsAnswerQuestions, { logging: false });
		await query.bulkInsert("ExamTests", examTests, { logging: false });
		await query.bulkInsert("PracticeTests", practiceTests, { logging: false });
		console.log("Seeding completed.");
	} catch (error) {
		console.error("Error seeding database:", error);
		throw error; // Rethrow the error to be handled by the caller
	}
}