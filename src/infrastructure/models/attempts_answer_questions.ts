import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional, Sequelize } from "sequelize";
import Attempt from "./attempt";
import Question from "./question";
import AttemptsAnswerMCQQuestions from "./attempts_answer_mcq_questions";
import AttemptsAnswerLAQuestions from "./attempts_answer_la_questions";

class AttemptsAnswerQuestions extends Model<InferAttributes<AttemptsAnswerQuestions>, InferCreationAttributes<AttemptsAnswerQuestions>> {
	declare id: CreationOptional<string>;
	declare attemptId: string;
	declare questionId: number;
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