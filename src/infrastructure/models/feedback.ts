import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import PracticeTest from "./practice_test";

export enum FeedbackProblemsEnum {
	"Inaccurate" = "inaccurate",
	"UnRelated" = "un-related",
	"PoorContent" = "poor content",
	"Incomplete" = "incomplete",
	"Repeated" = "repeated",
	"Error" = "error",
	"Other" = "other",
};

class Feedback extends Model<InferAttributes<Feedback>, InferCreationAttributes<Feedback>> {
	declare practiceTestId: string;
	declare rating: number;
	declare problems: FeedbackProblemsEnum[];
	declare comment: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare PracticeTest?: NonAttribute<PracticeTest>;

	declare static associations: {
		practiceTest: Association<Feedback, PracticeTest>;
	};

	static initModel(sequelize: Sequelize) {
		Feedback.init({
			practiceTestId: {
				primaryKey: true,
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: PracticeTest,
					key: "testId",
				},
			},
			rating: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					min: 1,
					max: 10,
				},
			},
			problems: {
				type: DataTypes.JSON,
				allowNull: false,
				validate: {
					isArrayOfStrings(value: any) {
						if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) {
							throw new Error('Problems must be an array of strings');
						}
					}
				},
				defaultValue: [],
			},
			comment: {
				type: DataTypes.TEXT,
				allowNull: false,
				defaultValue: "",
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			tableName: "Feedbacks",
			modelName: "Feedback",
			timestamps: true,
		});
	}

	static associate() {
		Feedback.belongsTo(PracticeTest, {
			foreignKey: "practiceTestId",
		});
	}
}

export default Feedback;