import { Association, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import AttemptsAnswerQuestions from "./attempts_answer_questions";

class AttemptsAnswerMCQQuestions extends Model<InferAttributes<AttemptsAnswerMCQQuestions>, InferCreationAttributes<AttemptsAnswerMCQQuestions>> {
	declare attemptAnswerQuestionId: number;
	declare chosenOption: number;

	declare Attempts_Answer_Questions?: NonAttribute<AttemptsAnswerQuestions>;

	declare static associations: {
		Attempts_Answer_Questions: Association<AttemptsAnswerMCQQuestions, AttemptsAnswerQuestions>;
	}

	static initModel(sequelize: Sequelize) {
		AttemptsAnswerMCQQuestions.init({
			attemptAnswerQuestionId: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				references: {
					model: AttemptsAnswerQuestions,
					key: "id",
				}
			},
			chosenOption: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		}, {
			sequelize,
			modelName: "Attempts_answer_MCQ_Questions",
			tableName: "Attempts_answer_MCQ_Questions",
		});
	}

	static associate() {
		AttemptsAnswerMCQQuestions.belongsTo(AttemptsAnswerQuestions, {
			onDelete: 'CASCADE',
		});
	}
}

export default AttemptsAnswerMCQQuestions;