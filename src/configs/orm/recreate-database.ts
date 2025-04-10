import mysql from 'mysql2/promise';
import { env } from '../../utils/env';

export default async function recreateDatabase() {
	const connection = await mysql.createConnection({
		user: env.db.username,
		password: env.db.password,
		host: env.db.host,
		port: env.db.port,
	});
	await connection.query(`DROP DATABASE IF EXISTS \`${env.db.database}\``);
	await connection.query(`CREATE DATABASE \`${env.db.database}\``);
	connection.end();
}