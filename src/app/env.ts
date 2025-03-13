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

export const env = {
	port: process.env.PORT || 3000,
	endpointLogging: process.env.ENDPOINT_LOGGING === "true",
	restApiDocumentation: process.env.REST_API_DOCUMENTATION === "true",
}