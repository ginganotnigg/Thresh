import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Test from "./test";
import { AttemptStatus } from "../common/domain/enum";
import AttemptsAnswerQuestions from "./attempts_answer_questions";

class Attempt extends Model<InferAttributes<Attempt>, InferCreationAttributes<Attempt>> {
	declare id: CreationOptional<number>;
	declare testId: number;
	declare candidateId: string;
	declare status: AttemptStatus;
	declare secondsSpent: number;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare Attempts_answer_Questions?: NonAttribute<AttemptsAnswerQuestions[]>;
	declare Test?: NonAttribute<Test>;

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
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			testId: {
				type: DataTypes.INTEGER,
				references: {
					model: Test,
					key: "id",
				},
			},
			candidateId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM,
				values: Object.values(AttemptStatus),
				allowNull: false,
			},
			secondsSpent: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			modelName: "Attempt",
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
	}
}



export default Attempt;