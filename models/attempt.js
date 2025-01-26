const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const Test = require("./test");

const Attempt = sequelize.define("Attempt", {
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
  candidateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  choices: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(), // Automatically set to the current date
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date(), // Automatically set to the current date
  },
}, {
  timestamps: false,
});

module.exports = Attempt;