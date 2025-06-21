import { Association, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Question from "./question";

class LAQuestion extends Model<InferAttributes<LAQuestion>, InferCreationAttributes<LAQuestion>> {
	declare questionId: number;
	declare imageLinks: CreationOptional<string[] | null>;
	declare extraText: CreationOptional<string | null>;
	declare correctAnswer: string;

	declare Question?: NonAttribute<Question>;

	declare static associations: {
		Question: Association<LAQuestion, Question>;
	};

	static initModel(sequelize: Sequelize) {
		LAQuestion.init({
			questionId: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				onDelete: 'CASCADE',
				references: {
					model: Question,
					key: 'id',
				}
			},
			imageLinks: {
				type: DataTypes.JSON, // Use JSON to store array of strings
				allowNull: true,
				defaultValue: null,
				validate: {
					isArrayOfStrings(value: any) {
						if (value && (!Array.isArray(value) || !value.every(item => typeof item === 'string'))) {
							throw new Error('Images must be an array of strings');
						}
					}
				}
			},
			extraText: {
				type: DataTypes.TEXT,
				allowNull: true,
				defaultValue: null,
			},
			correctAnswer: {
				type: DataTypes.TEXT,
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

export default LAQuestion;