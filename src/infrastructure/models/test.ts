import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Question from "./question";
import Attempt from "./attempt";
import PracticeTest from "./practice_test";
import ExamTest from "./exam_test";
import { TestModeAsConst } from "../../shared/enum";
import Feedback from "./feedback";

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
	declare Feedbacks?: NonAttribute<Feedback[]>;
	declare PracticeTest?: NonAttribute<PracticeTest>;
	declare ExamTest?: NonAttribute<ExamTest>;
	declare Feedback?: NonAttribute<Feedback[]>;

	declare static associations: {
		Questions: Association<Test, Question>;
		Attempts: Association<Test, Attempt>;
		Feedbacks: Association<Test, Feedback>;
		PracticeTest: Association<Test, PracticeTest>;
		ExamTest: Association<Test, ExamTest>;
		Feedback: Association<Test, Feedback>;
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
				type: DataTypes.STRING,
				allowNull: false,
			},
			language: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "english",
			},
			mode: {
				type: DataTypes.ENUM(...TestModeAsConst),
				allowNull: false,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			timestamps: true,
		});
	}

	static associate() {
		Test.hasMany(Question, {
			onDelete: 'CASCADE',
		});
		Test.hasMany(Attempt, {
			onDelete: 'CASCADE',
		});
		Test.hasMany(Feedback, {
			onDelete: 'CASCADE',
		});
	}
}

export default Test;