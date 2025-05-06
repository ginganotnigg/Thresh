import { Association, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from "sequelize";
import Attempt from "./attempt";
import Test from "./test";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<string>;
	declare name: string;
	declare avatar: string | undefined;
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	declare Attempts?: NonAttribute<Attempt[]>;
	declare Tests?: NonAttribute<Test[]>;

	declare static associations: {
		attempts: Association<User, Attempt>;
		tests: Association<User, Test>;
	};

	static initModel(sequelize: Sequelize) {
		User.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			avatar: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			tableName: "Users",
			modelName: "User",
		});
	}

	static associate() {
		User.hasMany(Attempt, {
			sourceKey: "id",
			foreignKey: "candidateId",
			onDelete: 'CASCADE',
		});
		User.hasMany(Test, {
			sourceKey: "id",
			foreignKey: "managerId",
			onDelete: 'CASCADE',
		})
	}
}

export default User;