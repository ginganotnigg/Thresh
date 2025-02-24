import sequelize from "../configs/sequelize/database";
import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";
import Test from "./test";

class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
	declare id: CreationOptional<number>;
	declare name: string;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

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
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			modelName: "Tag"
		});
	}

	static associate() {
		Tag.belongsToMany(Test, {
			through: "Tests_has_Tags",
			foreignKey: "tagId",
			sourceKey: "id",
			timestamps: false
		});
	}
}

export default Tag;