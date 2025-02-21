import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Question from "./question";
import Tag from "./tag";
import Attempt from "./attempt";

class Test extends Model<InferAttributes<Test>, InferCreationAttributes<Test>> {
	declare id: CreationOptional<number>;
	declare companyId: string;
	declare title: string;
	declare description: string;
	declare minutesToAnswer: number;
	declare difficulty: string;
	declare answerCount: number;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare questions?: NonAttribute<Question[]>;
	declare tags?: NonAttribute<Tag[]>;

	declare static associations: {
		questions: Association<Test, Question>;
		tags: Association<Test, Tag>;
	}

	static initModel(sequelize: Sequelize) {
		Test.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			companyId: {
				type: DataTypes.STRING,
				allowNull: false,
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
			difficulty: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			answerCount: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			modelName: "Test",
		});
	}

	static associate() {
		Test.hasMany(Question, {
			sourceKey: "id",
			foreignKey: "testId",
			onDelete: 'CASCADE',
			as: "questions",
		});
		Test.belongsToMany(Tag, {
			through: "Tests_has_Tags",
			foreignKey: "testId",
			sourceKey: "id",
			onDelete: 'CASCADE',
			as: "tags",
		});
		Test.hasMany(Attempt, {
			sourceKey: "id",
			foreignKey: "testId",
			onDelete: 'CASCADE',
			as: "attempts",
		});
	}
}

export default Test;