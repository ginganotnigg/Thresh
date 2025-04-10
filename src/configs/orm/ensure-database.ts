import mysql from 'mysql2/promise';
import { env } from '../../utils/env';

export default async function ensureDatabase() {
	const connection = await mysql.createConnection({
		user: env.db.username,
		password: env.db.password,
		host: env.db.host,
		port: env.db.port,
	});
	connection.query(`CREATE DATABASE IF NOT EXISTS ${env.db.database};`).then(() => {
		connection.end();
	});
}