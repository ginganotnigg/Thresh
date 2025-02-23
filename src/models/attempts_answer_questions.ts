import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional, Sequelize } from "sequelize";
import Attempt from "./attempt";
import Question from "./question";

class AttemptsAnswerQuestions extends Model<InferAttributes<AttemptsAnswerQuestions>, InferCreationAttributes<AttemptsAnswerQuestions>> {
	declare id: CreationOptional<number>;
	declare attemptId: number;
	declare questionId: number;
	declare chosenOption: number;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare question?: NonAttribute<Question>;
	declare attempt?: NonAttribute<Attempt>;

	declare static associations: {
		question: Association<AttemptsAnswerQuestions, Question>;
		attempt: Association<AttemptsAnswerQuestions, Attempt>;
	}

	static initModel(sequelize: Sequelize) {
		AttemptsAnswerQuestions.init({
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
			modelName: "Attempts_answer_Questions",
		});
	}

	static associate() {
		AttemptsAnswerQuestions.hasOne(Question, {
			sourceKey: "questionId",
			foreignKey: "id",
			as: "question",
		});
		AttemptsAnswerQuestions.belongsTo(Attempt, {
			foreignKey: "attemptId",
			as: "attempt",
		});
	}
}

export default AttemptsAnswerQuestions;