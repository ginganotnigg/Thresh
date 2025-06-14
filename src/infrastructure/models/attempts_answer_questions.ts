import { Association, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional, Sequelize } from "sequelize";
import Attempt from "./attempt";
import Question from "./question";
import AttemptsAnswerMCQQuestions from "./attempts_answer_mcq_questions";
import AttemptsAnswerLAQuestions from "./attempts_answer_la_questions";

class AttemptsAnswerQuestions extends Model<InferAttributes<AttemptsAnswerQuestions>, InferCreationAttributes<AttemptsAnswerQuestions>> {
	declare id: CreationOptional<string>;
	declare attemptId: ForeignKey<Attempt["id"]>;
	declare questionId: ForeignKey<Question["id"]>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare Question?: NonAttribute<Question>;
	declare Attempt?: NonAttribute<Attempt>;
	declare AttemptsAnswerMCQQuestions?: NonAttribute<AttemptsAnswerMCQQuestions>;
	declare AttemptsAnswerLAQuestions?: NonAttribute<AttemptsAnswerLAQuestions>;

	declare static associations: {
		Question: Association<AttemptsAnswerQuestions, Question>;
		Attempt: Association<AttemptsAnswerQuestions, Attempt>;
		AttemptsAnswerMCQQuestions: Association<AttemptsAnswerQuestions, AttemptsAnswerMCQQuestions>;
		AttemptsAnswerLAQuestions: Association<AttemptsAnswerQuestions, AttemptsAnswerLAQuestions>;
	}

	static initModel(sequelize: Sequelize) {
		AttemptsAnswerQuestions.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				primaryKey: true,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
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
			onDelete: 'CASCADE',
		});
		AttemptsAnswerQuestions.belongsTo(Attempt, {
			onDelete: 'CASCADE',
		});
		AttemptsAnswerQuestions.hasOne(AttemptsAnswerMCQQuestions, {
			onDelete: 'CASCADE',
		});
		AttemptsAnswerQuestions.hasOne(AttemptsAnswerLAQuestions, {
			onDelete: 'CASCADE',
		});
	}
}

export default AttemptsAnswerQuestions;