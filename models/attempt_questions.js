const sequelize = require("../utils/database/database");
const { DataTypes } = require("sequelize");
const Attempt = require("./attempt");
const Question = require("./question");

const AttemptQuestions = sequelize.define("Attempt_Questions", {
	ID: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	attemptId: {
		type: DataTypes.INTEGER,
		references: {
			model: Attempt,
			key: "ID",
		},
	},
	questionId: {
		type: DataTypes.INTEGER,
		references: {
			model: Question,
			key: "ID",
		},
	},
	chosenOption: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	createdAt: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: new Date(),
	},
	updatedAt: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: new Date(),
	},
}, {
	timestamps: false,
});

module.exports = AttemptQuestions;