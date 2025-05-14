import { Kysely, MysqlDialect, sql } from 'kysely';
import * as mysql from 'mysql2';
import { env } from "../../env";
import { logSqlCommand } from '../../logger/winston';
import { DB } from './generated';

// Database connection configuration
const dialect = new MysqlDialect({
	pool: mysql.createPool({
		host: env.db.host || 'localhost',
		user: env.db.username || 'root',
		password: env.db.password || '',
		database: env.db.database || 'skillsharp',
		port: env.db.port || 3306,
		connectionLimit: 10,
	})
});

// Create and export the Kysely instance
export const db = new Kysely<DB>({
	dialect,
	log(event) {
		if (event.level === 'query') {
			logSqlCommand(event.query.sql, event.query.parameters);
			logSqlCommand('Query duration:', event.queryDurationMillis);
		}
		if (event.level === 'error') {
			console.error(event.error);
		}
	},
});

// Helper function to check database connection
export async function testConnection(): Promise<boolean> {
	try {
		// Execute a SQL expression to check connection
		const result = await sql`SELECT 1 AS result`.execute(db);
		console.log('Database connection successful');
		return true;
	} catch (error) {
		console.error('Database connection failed:', error);
		return false;
	}
}