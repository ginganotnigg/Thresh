const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");

const Tag = sequelize.define("Tag", {
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
  timestamps: false,
});

module.exports = Tag;