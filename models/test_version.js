const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const User = require("./user");
const Test = require("./test");

const TestVersion = sequelize.define("TestVersion", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  testID: {
    type: DataTypes.INTEGER,
    references: {
      model: Test,
      key: "ID",
    },
  },
  versionNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "ID",
    },
  },
});

module.exports = TestVersion;
