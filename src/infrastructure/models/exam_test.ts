// filepath: d:\Projects\skillsharp\Thresh\src\domain\models\exam_test.ts
import { Association, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Test from "./test";
import ExamParticipants from "./exam_participants";

class ExamTest extends Model<InferAttributes<ExamTest>, InferCreationAttributes<ExamTest>> {
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
	declare ExamParticipants?: NonAttribute<ExamParticipants[]>;

	declare static associations: {
		Test: Association<ExamTest, Test>;
		ExamParticipants: Association<ExamTest, ExamParticipants>;
	}

	static initModel(sequelize: Sequelize) {
		ExamTest.init({
			testId: {
				primaryKey: true,
				type: DataTypes.UUID,
				references: {
					model: Test,
					key: 'id',
				}
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
		});
	}

	static associate() {
	}
}

export default ExamTest;