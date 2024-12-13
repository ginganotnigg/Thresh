const mysql = require('mysql2/promise');

async function createDatabaseIfNotExists() {
    try {
        const dbName = process.env.DB_DATABASE || 'myRandomDb';
        const connection = await mysql.createConnection({
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT
        });
        await connection.query('CREATE DATABASE IF NOT EXISTS ' + dbName + ';');
        console.log('Database created');
        await connection.end();
    } catch (error) {
        console.error('Error creating database:', error);
    }
}

module.exports = createDatabaseIfNotExists;