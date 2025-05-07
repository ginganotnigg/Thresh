import { seed } from "../../../__init__/seed";

export async function prepareForTest() {
	console.log("Preparing database for testing...");
	await seed();
}