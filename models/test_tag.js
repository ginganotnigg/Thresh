const sequelize = require("../utils/database/database");
const { DataTypes } = require("sequelize");
const Test = require("./test");
const Tag = require("./tag");

const Test_Tag = sequelize.define("Test_Tag", {
	ID: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
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
			model: Tag, // Name of the Tag table
			key: 'ID'
		}
	}
}, {
	timestamps: false,
});


// Define associations
Test.belongsToMany(Tag, { through: "Test_Tag", as: "tags", foreignKey: "testId" });
Tag.belongsToMany(Test, { through: "Test_Tag", as: "tests", foreignKey: "tagId" });

module.exports = Test_Tag;