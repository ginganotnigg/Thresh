import { configApplication } from "../src/app/server";

configApplication().then(() => {
	console.log("Documentation generated successfully");
}).catch((err) => {
	console.error(err);
	process.exit(1);
});