import { seed } from "../../../__scripts__/seed";

export async function prepareForTest() {
	console.log("Preparing database for testing...");
	await seed();
}