import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

class PromptTemplate extends Model<InferAttributes<PromptTemplate>, InferCreationAttributes<PromptTemplate>> {
	declare id: CreationOptional<string>;
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
		PromptTemplate.init({
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
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
				type: DataTypes.ARRAY(DataTypes.STRING),
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
				type: DataTypes.ARRAY(DataTypes.TEXT),
				allowNull: false,
				defaultValue: [],
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		}, {
			sequelize,
			tableName: "PromptTemplates",
			modelName: "PromptTemplate",
		});
	}

	static associate() {
		// Add associations when needed
	}
}

export default PromptTemplate;