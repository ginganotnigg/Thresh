import { Association, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import AttemptsAnswerQuestions from "./attempts_answer_questions";

class AttemptsAnswerLAQuestions extends Model<InferAttributes<AttemptsAnswerLAQuestions>, InferCreationAttributes<AttemptsAnswerLAQuestions>> {
	declare attemptAnswerQuestionId: string;
	declare answer: string;
	declare comment?: CreationOptional<string | null>;

	declare Attempts_Answer_Questions?: NonAttribute<AttemptsAnswerQuestions>;

	declare static associations: {
		Attempts_Answer_Questions: Association<AttemptsAnswerLAQuestions, AttemptsAnswerQuestions>;
	}

	static initModel(sequelize: Sequelize) {
		AttemptsAnswerLAQuestions.init({
			attemptAnswerQuestionId: {
				type: DataTypes.UUID,
				primaryKey: true,
				references: {
					model: AttemptsAnswerQuestions,
					key: "id",
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			answer: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			comment: {
				type: DataTypes.TEXT,
				allowNull: true,
				defaultValue: null,
			},
		}, {
			sequelize,
			timestamps: false,
		});
	}

	static associate() {
	}
}

export default AttemptsAnswerLAQuestions;