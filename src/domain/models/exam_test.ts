// filepath: d:\Projects\skillsharp\Thresh\src\domain\models\exam_test.ts
import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Test from "./test";

class ExamTest extends Model<InferAttributes<ExamTest>, InferCreationAttributes<ExamTest>> {
	declare id: CreationOptional<number>;
	declare testId: string;
	declare roomId: string;
	declare password: string | null;
	declare numberOfAttemptsAllowed: number;
	declare isAnswerVisible: boolean;
	declare isAllowedToSeeOtherResults: boolean;
	declare openDate: Date;
	declare closeDate: Date;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare Test?: NonAttribute<Test>;

	declare static associations: {
		test: Association<ExamTest, Test>;
	}

	static initModel(sequelize: Sequelize) {
		ExamTest.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			testId: {
				type: DataTypes.UUID,
				allowNull: false,
				unique: true,
				references: {
					model: Test,
					key: "id",
				},
			},
			roomId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			numberOfAttemptsAllowed: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			isAnswerVisible: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			isAllowedToSeeOtherResults: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			openDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			closeDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			tableName: "ExamTests",
			modelName: "ExamTest",
		});
	}

	static associate() {
		ExamTest.belongsTo(Test, {
			foreignKey: "testId",
			targetKey: "id",
		});
	}
}

export default ExamTest;