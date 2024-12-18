const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");

const TestTag = sequelize.define("TestTag", {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false // Disable createdAt and updatedAt
});

module.exports = TestTag;