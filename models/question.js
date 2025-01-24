const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const Test = require("./test");

const Question = sequelize.define("Question", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  testId: {
    type: DataTypes.INTEGER,
    references: {
      model: Test,
      key: "ID",
    },
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  correctAnswer: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false
});

module.exports = Question;
