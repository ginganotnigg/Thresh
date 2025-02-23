import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Test from "./test";
import { AttemptStatus } from "../common/domain/enum";
import AttemptsAnswerQuestions from "./attempts_answer_questions";


class Attempt extends Model<InferAttributes<Attempt>, InferCreationAttributes<Attempt>> {
	declare id: CreationOptional<number>;
	declare testId: number;
	declare candidateId: string;
	declare score: number;
	declare status: AttemptStatus;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare answerQuestions?: NonAttribute<AttemptsAnswerQuestions[]>;
	declare test?: NonAttribute<Test>;

	declare static associations: {
		answerQuestions: Association<Attempt, AttemptsAnswerQuestions>;
		test: Association<Attempt, Test>;
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
			score: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM,
				values: Object.values(AttemptStatus),
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
			as: "answerQuestions",
		});
		Attempt.belongsTo(Test, {
			foreignKey: "testId",
			as: "test",
		});
	}
}



export default Attempt;