import { Association, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Test from "./test";

class PracticeTest extends Model<InferAttributes<PracticeTest>, InferCreationAttributes<PracticeTest>> {
	declare testId: string;
	declare difficulty: string;
	declare tags: string[];
	declare numberOfQuestions: number;
	declare numberOfOptions: number;
	declare outlines: string[];

	declare Test?: NonAttribute<Test>;

	declare static associations: {
		Test: Association<PracticeTest, Test>;
	};

	static initModel(sequelize: Sequelize) {
		PracticeTest.init({
			testId: {
				primaryKey: true,
				type: DataTypes.UUID,
				references: {
					model: Test,
					key: 'id',
				},
				onDelete: "CASCADE",
				onUpdate: "CASCADE",
			},
			difficulty: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			tags: {
				type: DataTypes.JSON, // Store string array as JSON
				allowNull: false,
				validate: {
					isArrayOfStrings(value: any) {
						if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) {
							throw new Error('Tags must be an array of strings');
						}
					}
				}
			},
			numberOfQuestions: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			numberOfOptions: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			outlines: {
				type: DataTypes.JSON, // Store string array as JSON
				allowNull: false,
				validate: {
					isArrayOfStrings(value: any) {
						if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) {
							throw new Error('Outlines must be an array of strings');
						}
					}
				}
			},
		}, {
			sequelize,
			timestamps: false,
		});
	}

	static associate() {
	}
}

export default PracticeTest;