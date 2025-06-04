import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import ExamTest from "./exam_test";

class ExamParticipants extends Model<InferAttributes<ExamParticipants>, InferCreationAttributes<ExamParticipants>> {
	declare id: CreationOptional<string>;
	declare testId: string;
	declare candidateId: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare ExamTest?: NonAttribute<ExamTest>;

	declare static associations: {
		examTest: Association<ExamParticipants, ExamTest>;
	}

	static initModel(sequelize: Sequelize) {
		ExamParticipants.init({
			id: {
				primaryKey: true,
				type: DataTypes.UUID,
				allowNull: false,
				defaultValue: DataTypes.UUIDV4,
			},
			testId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: ExamTest,
					key: "testId",
				},
			},
			candidateId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			tableName: "ExamParticipants",
			modelName: "ExamParticipant",
			indexes: [
				{
					unique: true,
					fields: ["testId", "candidateId"],
				}
			]
		});
	}

	static associate() {
		ExamParticipants.belongsTo(ExamTest, {
			foreignKey: "testId",
		});
	}
}

export default ExamParticipants;