import { Association, col, CreationOptional, DataTypes, fn, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Question from "./question";
import Tag from "./tag";
import Attempt from "./attempt";
import { Op } from "sequelize";

class Test extends Model<InferAttributes<Test>, InferCreationAttributes<Test>> {
	declare id: CreationOptional<number>;
	declare companyId: string;
	declare title: string;
	declare description: string;
	declare minutesToAnswer: number;
	declare difficulty: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare Questions?: NonAttribute<Question[]>;
	declare Tags?: NonAttribute<Tag[]>;
	declare Attempts?: NonAttribute<Attempt[]>;

	get answerCount(): NonAttribute<number> {
		return 0;
	}

	declare static associations: {
		questions: Association<Test, Question>;
		tags: Association<Test, Tag>;
		attempts: Association<Test, Attempt>;
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
		});
		Test.belongsToMany(Tag, {
			through: "Tests_has_Tags",
			foreignKey: "testId",
			sourceKey: "id",
			onDelete: 'CASCADE',
		});
		Test.hasMany(Attempt, {
			sourceKey: "id",
			foreignKey: "testId",
			onDelete: 'CASCADE',
		});
	}
}

export default Test;