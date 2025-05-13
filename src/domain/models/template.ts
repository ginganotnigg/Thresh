import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

class Template extends Model<InferAttributes<Template>, InferCreationAttributes<Template>> {
	declare id: CreationOptional<string>;
	declare userId: string;
	declare name: string;
	declare title: string;
	declare description: string;
	declare difficulty: string;
	declare tags: string[];
	declare numberOfQuestions: number;
	declare numberOfOptions: number;
	declare outlines: string[];
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	static initModel(sequelize: Sequelize) {
		Template.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			userId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			difficulty: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			tags: {
				type: DataTypes.JSON,
				allowNull: false,
				defaultValue: [],
			},
			numberOfQuestions: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			numberOfOptions: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			outlines: {
				type: DataTypes.JSON,
				allowNull: false,
				defaultValue: [],
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			tableName: "Templates",
			modelName: "Template",
		});
	}

	static associate() {
		// Add associations when needed
	}
}

export default Template;