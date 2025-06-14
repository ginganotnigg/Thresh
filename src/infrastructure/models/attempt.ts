import { Association, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Test from "./test";
import AttemptsAnswerQuestions from "./attempts_answer_questions";
import { AttemptStatusAsConst, AttemptStatusType } from "../../domain/enum";

class Attempt extends Model<InferAttributes<Attempt>, InferCreationAttributes<Attempt>> {
	declare id: CreationOptional<string>;
	declare order: number;
	declare testId: ForeignKey<Test["id"]>;
	declare candidateId: string;
	declare hasEnded: CreationOptional<boolean>;
	declare secondsSpent: CreationOptional<number>;
	declare score: CreationOptional<number>;
	declare status: CreationOptional<AttemptStatusType>;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare Attempts_answer_Questions?: NonAttribute<AttemptsAnswerQuestions[]>;
	declare Test?: NonAttribute<Test>;

	declare static associations: {
		Attempts_answer_Questions: Association<Attempt, AttemptsAnswerQuestions>;
		Test: Association<Attempt, Test>;
	}

	static initModel(sequelize: Sequelize) {
		Attempt.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			order: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			candidateId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			hasEnded: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			secondsSpent: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			score: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM(...AttemptStatusAsConst),
				defaultValue: "IN_PROGRESS",
				allowNull: false,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			indexes: [
				{
					unique: true,
					fields: ["testId", "order", "candidateId"],
				},
			],
			timestamps: true,
		});
	}

	static associate() {
		Attempt.hasMany(AttemptsAnswerQuestions, {
			onDelete: 'CASCADE',
		});
		Attempt.belongsTo(Test, {
			onDelete: 'CASCADE',
		});
	}
}



export default Attempt;