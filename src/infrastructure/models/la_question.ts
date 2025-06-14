import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Question from "./question";

class LA_Question extends Model<InferAttributes<LA_Question>, InferCreationAttributes<LA_Question>> {
	declare questionId: number;
	declare imageLinks: CreationOptional<string[] | null>;
	declare extraText: CreationOptional<string | null>;
	declare correctAnswer: string;

	declare Question?: NonAttribute<Question>;

	declare static associations: {
		Question: Association<LA_Question, Question>;
	};

	static initModel(sequelize: Sequelize) {
		LA_Question.init({
			questionId: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				references: { model: Question }
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
		LA_Question.belongsTo(Question, {
			onDelete: 'CASCADE',
		});
	}
}

export default LA_Question;