import { Association, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Question from "./question";

class MCQ_Question extends Model<InferAttributes<MCQ_Question>, InferCreationAttributes<MCQ_Question>> {
	declare questionId: number;
	declare options: string[];
	declare correctOption: number;

	declare Question?: NonAttribute<Question>;

	declare static associations: {
		question: Association<MCQ_Question, Question>;
	};

	static initModel(sequelize: Sequelize) {
		MCQ_Question.init({
			questionId: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				references: {
					model: Question,
					key: "id",
				}
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
			correctOption: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		}, {
			sequelize,
			modelName: "MCQ_Question",
			tableName: "MCQ_Questions",
			timestamps: false,
		});
	}

	static associate() {
		MCQ_Question.belongsTo(Question, {
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		});
	}
}

export default MCQ_Question;