import { config } from "dotenv"

const envMode = process.env.NODE_ENV || "development";
console.log(`Environment mode: ${envMode}`);

config({
	path: [
		`${__dirname}/./../../.env`,
		`${__dirname}/./../../.env.${envMode}`,
	],
	override: true,
});

const env = {
	mode: envMode,
	db: {
		database: process.env.DB_DATABASE || "database",
		username: process.env.DB_USERNAME || "root",
		password: process.env.DB_PASSWORD || "123456",
		host: process.env.DB_HOST || "localhost",
		port: Number(process.env.DB_PORT) || 3300,
	},
	seedDatabase: process.env.SEED_DATABASE === "true",
	resetDatabase: process.env.RESET_DATABASE === "true",
	corsOrigin: process.env.CORS_ORIGIN || "*",
	port: process.env.PORT || 3000,
	socketPort: process.env.SOCKET_PORT || 3001,
	logLevel: process.env.LOG_LEVEL || "http",

	// Message Broker
	rabbitmqHost: process.env.RABBITMQ_HOST || "amqp://localhost:5672",

	// Development

	testDir: process.env.TEST_DIR,
	noAuth: process.env.NO_AUTH === "true",
	endpointLogging: process.env.ENDPOINT_LOGGING
		? process.env.ENDPOINT_LOGGING === "true"
		: true,
	databaseLogging: process.env.DATABASE_LOGGING
		? process.env.DATABASE_LOGGING === "true"
		: true,
	restApiDocumentation: process.env.REST_API_DOCUMENTATION === "true",
}

const logAbleEnv = {
	...env,
	db: {
		...env.db,
		password: "********",
	},
}

console.log("Loaded environment variables:");
console.log(logAbleEnv);

export { env };