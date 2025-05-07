import { seed } from "../__init__/seed";


seed()
	.then(() => {
		console.log("Seeding completed.");
	})
	.catch((error) => {
		console.error("Error seeding database:", error);
		throw error; // Rethrow the error to be handled by the caller
	});
