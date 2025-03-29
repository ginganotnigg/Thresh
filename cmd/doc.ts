import { configServer } from "../src/app/configServer";

configServer().then(() => {
	console.log("Documentation generated successfully");
	process.exit(0);
}).catch((err) => {
	console.error(err);
	process.exit(1);
});