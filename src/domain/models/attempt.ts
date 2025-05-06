import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Test from "./test";
import AttemptsAnswerQuestions from "./attempts_answer_questions";
import User from "./user";

class Attempt extends Model<InferAttributes<Attempt>, InferCreationAttributes<Attempt>> {
	declare id: CreationOptional<string>;
	declare order: number;
	declare testId: string;
	declare candidateId: string;
	declare hasEnded: CreationOptional<boolean>;
	declare secondsSpent: CreationOptional<number>;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare Attempts_answer_Questions?: NonAttribute<AttemptsAnswerQuestions[]>;
	declare Test?: NonAttribute<Test>;
	declare Candidate?: NonAttribute<User>;

	declare score?: NonAttribute<number>;
	declare totalQuestions?: NonAttribute<number>;
	declare totalCorrectAnswers?: NonAttribute<number>;
	declare totalWrongAnswers?: NonAttribute<number>;

	declare static associations: {
		Attempts_answer_Questions: Association<Attempt, AttemptsAnswerQuestions>;
		Test: Association<Attempt, Test>;
	}

	static initModel(sequelize: Sequelize) {
		Attempt.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			order: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			testId: {
				type: DataTypes.UUID,
				references: {
					model: Test,
					key: "id",
				},
			},
			candidateId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: User,
					key: "id",
				},
			},
			hasEnded: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			secondsSpent: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			modelName: "Attempt",
			tableName: "Attempts",
			indexes: [
				{
					unique: true,
					fields: ["testId", "order"]
				},
			]
		});
	}

	static associate() {
		Attempt.hasMany(AttemptsAnswerQuestions, {
			sourceKey: "id",
			foreignKey: "attemptId",
			onDelete: 'CASCADE',
		});
		Attempt.belongsTo(Test, {
			foreignKey: "testId",
		});
		Attempt.belongsTo(User, {
			foreignKey: "candidateId",
		});
	}
}



export default Attempt;