import { Association, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import AttemptsAnswerQuestions from "./attempts_answer_questions";

class AttemptsAnswerLAQuestions extends Model<InferAttributes<AttemptsAnswerLAQuestions>, InferCreationAttributes<AttemptsAnswerLAQuestions>> {
	declare attemptAnswerQuestionId: ForeignKey<AttemptsAnswerQuestions["id"]>;
	declare answer: string;

	declare Attempts_Answer_Questions?: NonAttribute<AttemptsAnswerQuestions>;

	declare static associations: {
		Attempts_Answer_Questions: Association<AttemptsAnswerLAQuestions, AttemptsAnswerQuestions>;
	}

	static initModel(sequelize: Sequelize) {
		AttemptsAnswerLAQuestions.init({
			attemptAnswerQuestionId: {
				type: DataTypes.INTEGER,
				primaryKey: true,
			},
			answer: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
		}, {
			sequelize,
			timestamps: false,
		});
	}

	static associate() {
		AttemptsAnswerLAQuestions.belongsTo(AttemptsAnswerQuestions, {
			onDelete: 'CASCADE',
		});
	}
}

export default AttemptsAnswerLAQuestions;