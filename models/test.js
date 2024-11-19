const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const User = require("./user");

const Test = sequelize.define("Test", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  BMID: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "ID",
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Test;
