import { config } from "dotenv";
config();

import { Sequelize } from "sequelize";
import { logSqlCommand } from "../logger/winston";

function logSql(sql: string) {
	logSqlCommand(sql);
}

const sequelize = new Sequelize(
	process.env.DB_DATABASE ?? "database",
	process.env.DB_USERNAME ?? "root",
	process.env.DB_PASSWORD ?? "123456",
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
		dialect: "mysql",
		logging: Boolean(process.env.DATABASE_LOGGING) ? logSql : false,
		dialectOptions: {
			connectTimeout: 0,
		}
	}
);

export default sequelize;