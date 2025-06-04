import { Sequelize } from "sequelize";
import { logSqlCommand } from "../../logger/winston";
import { env } from "../../env";
import Test from "../../../infrastructure/models/test";
import Attempt from "../../../infrastructure/models/attempt";
import AttemptsAnswerQuestions from "../../../infrastructure/models/attempts_answer_questions";
import Question from "../../../infrastructure/models/question";
import PracticeTest from "../../../infrastructure/models/practice_test";
import ExamTest from "../../../infrastructure/models/exam_test";
import Feedback from "../../../infrastructure/models/feedback";
import Template from "../../../infrastructure/models/template";
import ExamParticipants from "../../../infrastructure/models/exam_participants";

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
	Question.initModel(sequelize);
	Attempt.initModel(sequelize);
	AttemptsAnswerQuestions.initModel(sequelize);
	PracticeTest.initModel(sequelize);
	ExamTest.initModel(sequelize);
	Template.initModel(sequelize);
	Feedback.initModel(sequelize);
	ExamParticipants.initModel(sequelize);

	Test.associate();
	Question.associate();
	Attempt.associate();
	AttemptsAnswerQuestions.associate();
	PracticeTest.associate();
	ExamTest.associate();
	Template.associate();
	Feedback.associate();
	ExamParticipants.associate();
}

configSequelize(sequelize);

export default sequelize;