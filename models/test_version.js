const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
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
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false
});

module.exports = TestVersion;