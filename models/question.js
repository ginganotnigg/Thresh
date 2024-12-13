const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const User = require("./user");
const TestVersion = require("./test_version");

const Question = sequelize.define("Question", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  testVersionID: {
    type: DataTypes.INTEGER,
    references: {
      model: TestVersion,
      key: "ID",
    },
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  correctAnswer: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false // Disable createdAt and updatedAt
});

module.exports = Question;
