import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Test from "./test";
import AttemptsAnswerQuestions from "./attempts_answer_questions";

class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
	declare id: CreationOptional<number>;
	declare testId: string;
	declare text: string;
	declare options: string[];
	declare points: number;
	declare correctOption: number;

	declare Test?: NonAttribute<Test>;
	declare Attempts_answer_Questions?: NonAttribute<AttemptsAnswerQuestions[]>;

	declare static associations: {
		test: Association<Question, Test>;
	};

	static initModel(sequelize: Sequelize) {
		Question.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			testId: {
				type: DataTypes.UUID,
				references: {
					model: Test,
					key: "id",
				},
			},
			text: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			options: {
				type: DataTypes.JSON, // Use JSON to store array of strings
				allowNull: false,
				validate: {
					isArrayOfStrings(value: any) {
						if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) {
							throw new Error('Options must be an array of strings');
						}
					}
				}
			},
			points: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			correctOption: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		}, {
			sequelize,
			modelName: "Question",
			tableName: "Questions",
			timestamps: false,
		});
	}

	static associate() {
		Question.belongsTo(Test, {
			foreignKey: 'testId',
		});

		Question.hasMany(AttemptsAnswerQuestions, {
			sourceKey: "id",
			foreignKey: "questionId",
			onDelete: 'CASCADE',
		});
	}
}

export default Question;