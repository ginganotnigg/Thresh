const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const Submission = require("./submission");
const Question = require("./question");

const Answer = sequelize.define("Answer", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  submissionID: {
    type: DataTypes.INTEGER,
    references: {
      model: Submission,
      key: "ID",
    },
  },
  questionID: {
    type: DataTypes.INTEGER,
    references: {
      model: Question,
      key: "ID",
    },
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Answer;
