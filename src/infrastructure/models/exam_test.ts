// filepath: d:\Projects\skillsharp\Thresh\src\domain\models\exam_test.ts
import { Association, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Test from "./test";
import ExamParticipants from "./exam_participants";

class ExamTest extends Model<InferAttributes<ExamTest>, InferCreationAttributes<ExamTest>> {
	declare testId: string;
	declare roomId: string;
	declare password: string | null;
	declare numberOfAttemptsAllowed: CreationOptional<number>;
	declare numberOfParticipants: CreationOptional<number>;
	declare isAnswerVisible: boolean;
	declare isAllowedToSeeOtherResults: boolean;
	declare isPublic: CreationOptional<boolean>;
	declare openDate: Date;
	declare closeDate: Date;

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
			numberOfParticipants: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
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
			isPublic: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
			openDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			closeDate: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		}, {
			sequelize,
		});
	}

	static associate() {
	}
}

export default ExamTest;