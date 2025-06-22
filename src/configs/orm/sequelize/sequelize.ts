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
import AttemptsAnswerMCQQuestions from "../../../infrastructure/models/attempts_answer_mcq_questions";
import AttemptsAnswerLAQuestions from "../../../infrastructure/models/attempts_answer_la_questions";
import MCQQuestion from "../../../infrastructure/models/mcq_question";
import LAQuestion from "../../../infrastructure/models/la_question";

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
		},
		timezone: "+07:00", // Use UTC timezone
	}
);

// Define associations
function configSequelize(sequelize: Sequelize) {
	Test.initModel(sequelize);
	Question.initModel(sequelize);
	MCQQuestion.initModel(sequelize);
	LAQuestion.initModel(sequelize);
	Attempt.initModel(sequelize);
	AttemptsAnswerQuestions.initModel(sequelize);
	AttemptsAnswerMCQQuestions.initModel(sequelize);
	AttemptsAnswerLAQuestions.initModel(sequelize);
	PracticeTest.initModel(sequelize);
	ExamTest.initModel(sequelize);
	Template.initModel(sequelize);
	Feedback.initModel(sequelize);
	ExamParticipants.initModel(sequelize);


	Test.associate();
	Question.associate();
	MCQQuestion.associate();
	LAQuestion.associate();
	Attempt.associate();
	AttemptsAnswerQuestions.associate();
	AttemptsAnswerMCQQuestions.associate();
	AttemptsAnswerLAQuestions.associate();
	PracticeTest.associate();
	ExamTest.associate();
	Template.associate();
	Feedback.associate();
	ExamParticipants.associate();
}

configSequelize(sequelize);

export default sequelize;