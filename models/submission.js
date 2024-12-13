const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const User = require("./user");
const TestVersion = require("./test_version");

const Submission = sequelize.define("Submission", {
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
  candidateID: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "ID",
    },
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Submission;
