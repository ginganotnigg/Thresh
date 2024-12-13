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
    type: DataTypes.STRING,
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
}, {
  timestamps: false // Disable createdAt and updatedAt
});

module.exports = TestVersion;
