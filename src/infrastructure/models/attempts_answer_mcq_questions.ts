import { Association, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import AttemptsAnswerQuestions from "./attempts_answer_questions";

class AttemptsAnswerMCQQuestions extends Model<InferAttributes<AttemptsAnswerMCQQuestions>, InferCreationAttributes<AttemptsAnswerMCQQuestions>> {
	declare attemptAnswerQuestionId: ForeignKey<AttemptsAnswerQuestions["id"]>;
	declare chosenOption: number;

	declare Attempts_Answer_Questions?: NonAttribute<AttemptsAnswerQuestions>;

	declare static associations: {
		Attempts_Answer_Questions: Association<AttemptsAnswerMCQQuestions, AttemptsAnswerQuestions>;
	}

	static initModel(sequelize: Sequelize) {
		AttemptsAnswerMCQQuestions.init({
			attemptAnswerQuestionId: {
				type: DataTypes.INTEGER,
				primaryKey: true,
			},
			chosenOption: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		}, {
			sequelize,
			timestamps: false,
		});
	}

	static associate() {
		AttemptsAnswerMCQQuestions.belongsTo(AttemptsAnswerQuestions, {
			onDelete: 'CASCADE',
		});
	}
}

export default AttemptsAnswerMCQQuestions;