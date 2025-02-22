require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_TYPE || 'mysql', // Lấy `DB_TYPE` từ file .env
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_TEST,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_TYPE || 'mysql',
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_PROD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_TYPE || 'mysql',
    },
};
