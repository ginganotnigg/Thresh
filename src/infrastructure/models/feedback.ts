import { Association, CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import { FeedbackProblemsType } from "../../shared/enum";
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
		Test: Association<Feedback, Test>;
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
				onDelete: 'CASCADE',
				references: {
					model: Test,
					key: 'id',
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
			timestamps: true,
		});
	}

	static associate() {
	}
}

export default Feedback;