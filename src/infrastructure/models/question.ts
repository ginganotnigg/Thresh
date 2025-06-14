import { Association, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Test from "./test";
import AttemptsAnswerQuestions from "./attempts_answer_questions";
import { QuestionTypesAsConst } from "../../domain/enum";
import MCQQuestion from "./mcq_question";
import LAQuestion from "./la_question";

class Question extends Model<InferAttributes<Question>, InferCreationAttributes<Question>> {
	declare id: CreationOptional<number>;
	declare testId: ForeignKey<Test["id"]>;
	declare text: string;
	declare points: number;
	declare type: string;

	declare Test?: NonAttribute<Test>;
	declare Attempts_answer_Questions?: NonAttribute<AttemptsAnswerQuestions[]>;
	declare MCQ_Question?: NonAttribute<MCQQuestion>;
	declare LA_Question?: NonAttribute<LAQuestion>;

	declare static associations: {
		Test: Association<Question, Test>;
		Attempts_answer_Questions: Association<Question, AttemptsAnswerQuestions>;
		MCQ_Question: Association<Question, MCQQuestion>;
		LA_Question: Association<Question, LAQuestion>;
	};

	static initModel(sequelize: Sequelize) {
		Question.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
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
			onDelete: 'CASCADE',
		});
		Question.hasMany(AttemptsAnswerQuestions, {
			onDelete: 'CASCADE',
		});
		Question.hasOne(MCQQuestion, {
			onDelete: 'CASCADE',
		});
		Question.hasOne(LAQuestion, {
			onDelete: 'CASCADE',
		});
	}
}

export default Question;