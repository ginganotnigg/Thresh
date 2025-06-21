import { Association, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Question from "./question";

class MCQQuestion extends Model<InferAttributes<MCQQuestion>, InferCreationAttributes<MCQQuestion>> {
	declare questionId: number;
	declare options: string[];
	declare correctOption: number;

	declare Question?: NonAttribute<Question>;

	declare static associations: {
		Question: Association<MCQQuestion, Question>;
	};

	static initModel(sequelize: Sequelize) {
		MCQQuestion.init({
			questionId: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				onDelete: 'CASCADE',
				references: {
					model: Question,
					key: 'id',
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
			timestamps: false,
		});
	}

	static associate() {
	}
}

export default MCQQuestion;