import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import { FeedbackProblemsType } from "../../domain/enum";
import Test from "./test";

class Feedback extends Model<InferAttributes<Feedback>, InferCreationAttributes<Feedback>> {
	declare id: CreationOptional<string>;
	declare testId: string;
	declare rating: number;
	declare problems: FeedbackProblemsType[];
	declare comment: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare Test?: NonAttribute<Test>;

	declare static associations: {
		practiceTest: Association<Feedback, Test>;
	};

	static initModel(sequelize: Sequelize) {
		Feedback.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			testId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: { model: Test }
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
		Feedback.belongsTo(Test);
	}
}

export default Feedback;