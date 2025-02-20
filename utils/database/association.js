const Test = require("../../models/test");
const Question = require("../../models/question");
const Attempt = require("../../models/attempt");
const AttemptQuestions = require("../../models/attempt_questions");


module.exports = () => {
	Test.hasMany(Question, { foreignKey: 'testId' });
	Question.belongsTo(Test, { foreignKey: 'testId' });

	Test.hasMany(Attempt, { foreignKey: 'testId' });
	Attempt.belongsTo(Test, { foreignKey: 'testId' });

	Attempt.hasMany(AttemptQuestions, { foreignKey: 'attemptId' });
	AttemptQuestions.belongsTo(Attempt, { foreignKey: 'attemptId' });
}