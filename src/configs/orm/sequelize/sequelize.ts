import { Sequelize } from "sequelize";
import { logSqlCommand } from "../../logger/winston";
import { env } from "../../env";
import Test from "../../../domain/models/test";
import Attempt from "../../../domain/models/attempt";
import AttemptsAnswerQuestions from "../../../domain/models/attempts_answer_questions";
import Question from "../../../domain/models/question";
import PracticeTest from "../../../domain/models/practice_test";
import ExamTest from "../../../domain/models/exam_test";
import User from "../../../domain/models/user";
import Feedback from "../../../domain/models/feedback";
import Template from "../../../domain/models/template";

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
	User.initModel(sequelize);
	Test.initModel(sequelize);
	Question.initModel(sequelize);
	Attempt.initModel(sequelize);
	AttemptsAnswerQuestions.initModel(sequelize);
	PracticeTest.initModel(sequelize);
	ExamTest.initModel(sequelize);
	Template.initModel(sequelize);
	Feedback.initModel(sequelize);

	User.associate();
	Test.associate();
	Question.associate();
	Attempt.associate();
	AttemptsAnswerQuestions.associate();
	PracticeTest.associate();
	ExamTest.associate();
	Template.associate();
	Feedback.associate();
}

configSequelize(sequelize);

export default sequelize;