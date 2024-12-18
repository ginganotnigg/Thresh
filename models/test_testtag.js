const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const Test = require("./test");
const TestTag = require("./test_tag");

const Test_TestTag = sequelize.define("Test_TestTag", {
  testId: {
    type: DataTypes.INTEGER,
    references: {
      model: Test,
      key: 'ID'
    }
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: TestTag, // Name of the Tag table
      key: 'ID'
    }
  }
}, {
  timestamps: false // Disable createdAt and updatedAt
});

// Define associations
Test.belongsToMany(TestTag, { through: "Test_TestTag", as: "tags", foreignKey: "testId" });
TestTag.belongsToMany(Test, { through: "Test_TestTag", as: "tests", foreignKey: "tagId" });

module.exports = Test_TestTag;