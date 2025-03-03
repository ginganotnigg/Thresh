import { config } from "dotenv";
config();

import { Sequelize } from "sequelize";
import { logSqlCommand } from "../logger/winston";
import Attempt from "../../models/attempt";
import AttemptsAnswerQuestions from "../../models/attempts_answer_questions";
import Question from "../../models/question";
import Tag from "../../models/tag";
import Test from "../../models/test";

const sequelize = new Sequelize(
	process.env.DB_DATABASE ?? "database",
	process.env.DB_USERNAME ?? "root",
	process.env.DB_PASSWORD ?? "123456",
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
		dialect: "mysql",
		logging: Boolean(process.env.DATABASE_LOGGING) ? logSqlCommand : false,
		dialectOptions: {
			connectTimeout: 0,
		},
		define: {
			timestamps: true,
		}
	}
);

// Define associations
function configSequelize(sequelize: Sequelize) {
	Test.initModel(sequelize);
	Tag.initModel(sequelize);
	Question.initModel(sequelize);
	Attempt.initModel(sequelize);
	AttemptsAnswerQuestions.initModel(sequelize);

	Test.associate();
	Tag.associate();
	Question.associate();
	Attempt.associate();
	AttemptsAnswerQuestions.associate();
}

configSequelize(sequelize);

export default sequelize;