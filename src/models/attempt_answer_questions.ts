import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional, Sequelize } from "sequelize";
import Attempt from "./attempt";
import Question from "./question";

class AttemptAnswerQuestions extends Model<InferAttributes<AttemptAnswerQuestions>, InferCreationAttributes<AttemptAnswerQuestions>> {
	declare id: CreationOptional<number>;
	declare attemptId: number;
	declare questionId: number;
	declare chosenOption: number;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare question?: NonAttribute<Question>;
	declare attempt?: NonAttribute<Attempt>;

	declare static associations: {
		question: Association<AttemptAnswerQuestions, Question>;
		attempt: Association<AttemptAnswerQuestions, Attempt>;
	}

	static initModel(sequelize: Sequelize) {
		AttemptAnswerQuestions.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			attemptId: {
				type: DataTypes.INTEGER,
				references: {
					model: Attempt,
					key: "id",
				},
			},
			questionId: {
				type: DataTypes.INTEGER,
				references: {
					model: Question,
					key: "id",
				},
			},
			chosenOption: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			modelName: "Attempt_answer_Questions",
		});
	}

	static associate() {
		AttemptAnswerQuestions.hasOne(Question, {
			sourceKey: "questionId",
			foreignKey: "id",
			as: "question",
		});
		AttemptAnswerQuestions.belongsTo(Attempt, {
			foreignKey: "attemptId",
			as: "attempt",
		});
	}
}

export default AttemptAnswerQuestions;