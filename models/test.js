const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const Question = require("./question");

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
}, {
  hooks: {
    beforeDestroy: async (test, options) => {
      await Question.destroy({ where: { testId: test.ID } });
    }
  }
});

module.exports = Test;