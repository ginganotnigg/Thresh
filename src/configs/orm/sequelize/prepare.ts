import { seed } from "../../../__seed__/seed";

export async function prepareForTest() {
	console.log("Preparing database for testing...");
	await seed();
}