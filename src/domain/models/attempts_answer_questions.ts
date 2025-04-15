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

	declare Question?: NonAttribute<Question>;
	declare Attempt?: NonAttribute<Attempt>;

	declare static associations: {
		Question: Association<AttemptsAnswerQuestions, Question>;
		Attempt: Association<AttemptsAnswerQuestions, Attempt>;
	}

	get isCorrect(): NonAttribute<boolean> {
		return this.chosenOption === this.Question!.correctOption;
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
			tableName: "Attempts_answer_Questions",
			indexes: [
				{
					unique: true,
					fields: ["attemptId", "questionId"]
				}
			]
		});
	}

	static associate() {
		AttemptsAnswerQuestions.belongsTo(Question, {
			foreignKey: "questionId",
		});

		AttemptsAnswerQuestions.belongsTo(Attempt, {
			foreignKey: "attemptId",
		});
	}
}

export default AttemptsAnswerQuestions;