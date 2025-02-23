require('dotenv').config();

const baseConfig = {
	username: process.env.DB_USERNAME ?? 'root',
	password: process.env.DB_PASSWORD ?? '123456',
	database: process.env.DB_DATABASE ?? 'thresh',
	host: process.env.DB_HOST ?? 'localhost',
	port: process.env.DB_PORT ?? '3306',
	dialect: process.env.DB_TYPE || 'mysql',
};

const devConfig = {
	username: process.env.DB_DEV_USERNAME || baseConfig.username,
	password: process.env.DB_DEV_PASSWORD || baseConfig.password,
	database: process.env.DB_DEV_DATABASE || baseConfig.database,
	host: process.env.DB_DEV_HOST || baseConfig.host,
	port: process.env.DB_DEV_PORT || baseConfig.port,
	dialect: process.env.DB_DEV_TYPE || baseConfig.dialect,
};

const testConfig = {
	username: process.env.DB_TEST_USERNAME || baseConfig.username,
	password: process.env.DB_TEST_PASSWORD || baseConfig.password,
	database: process.env.DB_TEST_DATABASE || baseConfig.database,
	host: process.env.DB_TEST_HOST || baseConfig.host,
	port: process.env.DB_TEST_PORT || baseConfig.port,
	dialect: process.env.DB_TEST_TYPE || baseConfig.dialect,
};

const prodConfig = {
	username: process.env.DB_PROD_USERNAME || baseConfig.username,
	password: process.env.DB_PROD_PASSWORD || baseConfig.password,
	database: process.env.DB_PROD_DATABASE || baseConfig.database,
	host: process.env.DB_PROD_HOST || baseConfig.host,
	port: process.env.DB_PROD_PORT || baseConfig.port,
	dialect: process.env.DB_PROD_TYPE || baseConfig.dialect,
};

const config = {
	database: {
		development: devConfig,
		test: testConfig,
		production: prodConfig
	},
	modes: {
		seed: process.env.SEED_DATA || 'false',
		no_auth: process.env.NO_AUTH || 'false'
	},
	port: process.env.PORT || '8000'
};

export default config;