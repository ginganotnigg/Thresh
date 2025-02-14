const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");

const Test = sequelize.define("Test", {
	ID: {
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
	createdAt: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: new Date(), // Automatically set to the current date
	},
	updatedAt: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: new Date(), // Automatically set to the current date
	},
}, {
	timestamps: false,
});

module.exports = Test;