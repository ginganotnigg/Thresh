const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const User = require("./user");

const Test = sequelize.define("Test", {
  ID: {
    type: DataTypes.STRING,
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
    type: DataTypes.TEXT,
    allowNull: true,
  },
  minutesToAnswer: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  answersCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  BMID: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "ID",
    },
  },
});

module.exports = Test;
