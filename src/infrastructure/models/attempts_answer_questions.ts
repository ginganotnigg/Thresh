import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional, Sequelize } from "sequelize";
import Attempt from "./attempt";
import Question from "./question";

class AttemptsAnswerQuestions extends Model<InferAttributes<AttemptsAnswerQuestions>, InferCreationAttributes<AttemptsAnswerQuestions>> {
	declare id: CreationOptional<string>;
	declare attemptId: string;
	declare questionId: number;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare Question?: NonAttribute<Question>;
	declare Attempt?: NonAttribute<Attempt>;

	declare static associations: {
		Question: Association<AttemptsAnswerQuestions, Question>;
		Attempt: Association<AttemptsAnswerQuestions, Attempt>;
	}

	static initModel(sequelize: Sequelize) {
		AttemptsAnswerQuestions.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			attemptId: {
				allowNull: false,
				type: DataTypes.UUID,
				references: { model: Attempt },
			},
			questionId: {
				allowNull: false,
				type: DataTypes.INTEGER,
				references: { model: Question },
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
					fields: ["attemptId", "questionId"],
				}
			],
			timestamps: true,
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