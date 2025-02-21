import sequelize from "../configs/sequelize/database";
import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import Test from "./test";

class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
	declare id: CreationOptional<number>;
	declare name: string;

	declare static associations: {
		tests: Association<Tag, Test>;
	}

	static initModel(sequelize: Sequelize) {
		Tag.init({
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		}, {
			sequelize,
			modelName: "Tag",
			timestamps: false,
		});
	}

	static associate() {
		Tag.belongsToMany(Test, {
			through: "Tests_has_Tags",
			foreignKey: "tagId",
			sourceKey: "id",
			as: "tests",
		});
	}
}

export default Tag;