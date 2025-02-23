import { config } from "dotenv";
config();

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
	process.env.DB_DATABASE ?? "database",
	process.env.DB_USERNAME ?? "root",
	process.env.DB_PASSWORD ?? "123456",
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
		dialect: "mysql",
		logging: Boolean(process.env.DATABASE_LOGGING) ? console.log : false,
		define: {
			timestamps: false
		},
	}
);

export default sequelize;