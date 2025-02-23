import Test from "../../models/test";
import Tag from "../../models/tag";
import Question from "../../models/question";
import Attempt from "../../models/attempt";
import AttemptsAnswerQuestions from "../../models/attempts_answer_questions";
import sequelize from "./database";

// Define associations
function config() {
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

export default config;