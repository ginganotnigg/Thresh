import { Association, CreationOptional, DataTypes, HasManySetAssociationsMixin, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Question from "./question";
import Attempt from "./attempt";
import PracticeTest from "./practice_test";
import ExamTest from "./exam_test";
import User from "./user";

class Test extends Model<InferAttributes<Test>, InferCreationAttributes<Test>> {
	declare id: CreationOptional<string>;
	declare authorId: string;
	declare title: string;
	declare description: string;
	declare minutesToAnswer: number;
	declare language: string;
	declare mode: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare Questions?: NonAttribute<Question[]>;
	declare Attempts?: NonAttribute<Attempt[]>;
	declare PracticeTest?: NonAttribute<PracticeTest>;
	declare ExamTest?: NonAttribute<ExamTest>;
	declare Author?: NonAttribute<User>;

	declare static associations: {
		questions: Association<Test, Question>;
		attempts: Association<Test, Attempt>;
		practiceTest: Association<Test, PracticeTest>;
		examTest: Association<Test, ExamTest>;
		author: Association<Test, User>;
	}

	static initModel(sequelize: Sequelize) {
		Test.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			minutesToAnswer: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			authorId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: User,
					key: "id",
				},
			},
			language: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "english",
			},
			mode: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			tableName: "Tests",
			modelName: "Test",
		});
	}

	static associate() {
		Test.hasMany(Question, {
			sourceKey: "id",
			foreignKey: "testId",
			onDelete: 'CASCADE',
		});
		Test.hasMany(Attempt, {
			sourceKey: "id",
			foreignKey: "testId",
			onDelete: 'CASCADE',
		});
		// A Test may have zero or one PracticeTest
		Test.hasOne(PracticeTest, {
			sourceKey: "id",
			foreignKey: "testId",
			onDelete: 'CASCADE',
		});
		// A Test may have zero or one ExamTest
		Test.hasOne(ExamTest, {
			sourceKey: "id",
			foreignKey: "testId",
			onDelete: 'CASCADE',
		});
		Test.belongsTo(User, {
			foreignKey: "authorId",
			as: "Author",
		});
	}
}

export default Test;