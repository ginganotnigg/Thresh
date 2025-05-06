import { Sequelize } from "sequelize";
import { logSqlCommand } from "../logger/winston";
import { env } from "../../utils/env";
import Test from "../../domain/models/test";
import Attempt from "../../domain/models/attempt";
import AttemptsAnswerQuestions from "../../domain/models/attempts_answer_questions";
import Question from "../../domain/models/question";
import Tag from "../../domain/models/tag";
import PracticeTest from "../../domain/models/practice_test";
import ExamTest from "../../domain/models/exam_test";
import User from "../../domain/models/user";

const sequelize = new Sequelize(
	env.db.database,
	env.db.username,
	env.db.password,
	{
		host: env.db.host,
		port: env.db.port,
		dialect: "mysql",
		logging: env.databaseLogging ? logSqlCommand : false,
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
	PracticeTest.initModel(sequelize);
	ExamTest.initModel(sequelize);
	User.initModel(sequelize);

	Test.associate();
	Tag.associate();
	Question.associate();
	Attempt.associate();
	AttemptsAnswerQuestions.associate();
	PracticeTest.associate();
	ExamTest.associate();
	User.associate();
}

configSequelize(sequelize);

export default sequelize;