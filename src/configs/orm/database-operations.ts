import mysql from 'mysql2/promise';
import { env } from '../env';

export async function recreateDatabase() {
	try {
		console.log('Recreating database...');
		const connection = await mysql.createConnection({
			user: env.db.username,
			password: env.db.password,
			host: env.db.host,
			port: env.db.port,
		});
		await connection.query(`DROP DATABASE IF EXISTS \`${env.db.database}\``);
		await connection.query(`CREATE DATABASE \`${env.db.database}\``);
		connection.end();
		console.log('Database recreated successfully.');
	} catch (error) {
		console.error('Error recreating database:', error);
		throw error;
	}
}

export async function ensureDatabase() {
	try {
		console.log('Ensuring database exists...');
		const connection = await mysql.createConnection({
			user: env.db.username,
			password: env.db.password,
			host: env.db.host,
			port: env.db.port,
		});
		await connection.query(`CREATE DATABASE IF NOT EXISTS ${env.db.database};`);
		console.log(`Database ${env.db.database} ensured.`);
		connection.end();
	} catch (error) {
		console.error('Error ensuring database:', error);
		throw error;
	}
}