import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Test from "./test";
import Feedback from "./feedback";

class PracticeTest extends Model<InferAttributes<PracticeTest>, InferCreationAttributes<PracticeTest>> {
	declare testId: string;
	declare difficulty: string;
	declare tags: string[];
	declare numberOfQuestions: number;
	declare numberOfOptions: number;
	declare outlines: string[];
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare Test?: NonAttribute<Test>;
	declare Feedback?: NonAttribute<Feedback>;

	declare static associations: {
		test: Association<PracticeTest, Test>;
	};

	static initModel(sequelize: Sequelize) {
		PracticeTest.init({
			testId: {
				primaryKey: true,
				type: DataTypes.UUID,
				unique: true,
				allowNull: false,
				references: {
					model: Test,
					key: "id",
				},
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
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			tableName: "PracticeTests",
			modelName: "PracticeTest",
		});
	}

	static associate() {
		// PracticeTest has a mandatory relation to Test (belongs to a Test)
		PracticeTest.belongsTo(Test, {
			foreignKey: 'testId',
		});

		PracticeTest.hasOne(Feedback, {
			foreignKey: 'practiceTestId',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		})
	}
}

export default PracticeTest;