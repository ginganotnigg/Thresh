import { seed } from "../__seed__/seed";

seed().then(() => {
	console.log("Database seeded successfully.");
}).catch((error) => {
	console.error("Error seeding database:", error);
	process.exit(1); // Exit with failure code
});