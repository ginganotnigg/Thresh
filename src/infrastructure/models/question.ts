import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Test from "./test";
import AttemptsAnswerQuestions from "./attempts_answer_questions";
import { QuestionTypesAsConst } from "../../domain/enum";
import MCQ_Question from "./mcq_question";
import LA_Question from "./la_question";

class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
	declare id: CreationOptional<number>;
	declare testId: string;
	declare text: string;
	declare points: number;
	declare type: string;

	declare Test?: NonAttribute<Test>;
	declare Attempts_answer_Questions?: NonAttribute<AttemptsAnswerQuestions[]>;
	declare MCQ_Question?: NonAttribute<MCQ_Question>;
	declare LA_Question?: NonAttribute<LA_Question>;

	declare static associations: {
		Test: Association<Question, Test>;
		Attempts_answer_Questions: Association<Question, AttemptsAnswerQuestions>;
		MCQ_Question: Association<Question, MCQ_Question>;
		LA_Question: Association<Question, LA_Question>;
	};

	static initModel(sequelize: Sequelize) {
		Question.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			testId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: { model: Test },
			},
			text: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			points: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			type: {
				type: DataTypes.ENUM(...QuestionTypesAsConst),
				allowNull: false,
			},
		}, {
			sequelize,
			timestamps: false,
		});
	}

	static associate() {
		Question.belongsTo(Test, {
			foreignKey: 'testId',
		});
		Question.hasMany(AttemptsAnswerQuestions, {
			onDelete: 'CASCADE',
		});
		Question.hasOne(MCQ_Question, {
			onDelete: 'CASCADE',
		});
		Question.hasOne(LA_Question, {
			onDelete: 'CASCADE',
		});
	}
}

export default Question;