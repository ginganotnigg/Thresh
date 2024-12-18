const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");

const Test = sequelize.define("Test", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  company: {
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
    allowNull: false,
  },
  answerCount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Test;