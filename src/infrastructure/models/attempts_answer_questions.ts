import { Association, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Optional, Sequelize } from "sequelize";
import Attempt from "./attempt";
import Question from "./question";
import AttemptsAnswerMCQQuestions from "./attempts_answer_mcq_questions";
import AttemptsAnswerLAQuestions from "./attempts_answer_la_questions";

class AttemptsAnswerQuestions extends Model<InferAttributes<AttemptsAnswerQuestions>, InferCreationAttributes<AttemptsAnswerQuestions>> {
	declare id: CreationOptional<string>;
	declare attemptId: string;
	declare questionId: number;
	declare pointsReceived: CreationOptional<number>;
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
				defaultValue: DataTypes.UUID,
				allowNull: false,
				primaryKey: true,
			},
			attemptId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: Attempt,
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
			questionId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: Question,
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
			pointsReceived: {
				type: DataTypes.INTEGER,
				allowNull: true,
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
	}
}

export default AttemptsAnswerQuestions;