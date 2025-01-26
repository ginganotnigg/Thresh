require("dotenv").config();
const { Sequelize } = require("sequelize");

console.log("DB_TYPE:", process.env.DB_TYPE); // Debugging line
if (typeof process.env.DB_TYPE !== 'string') {
  throw new Error(`DB_TYPE is not a string: ${typeof process.env.DB_TYPE}`);
}
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    define: {
      timestamps: false, // Tắt createdAt và updatedAt cho toàn bộ bảng
    },
  }
);

module.exports = sequelize;
