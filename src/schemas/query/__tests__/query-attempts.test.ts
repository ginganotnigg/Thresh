import { queryAttempts } from "../attempts";

describe("Query Attempts", () => {

	it.skip("should return attempts with correct structure", async () => {
		const result = await queryAttempts({
			testId: "42b8aa35-7ff9-4f5a-9fe7-89b9efa3b558",
			page: 1,
			perPage: 10,
		});

		expect(result).toHaveProperty("data");
		console.log(result.data);

	});

	it.skip("should sort attempts by createdAt", async () => {
		const result = await queryAttempts({
			testId: "9bdc255f-5a89-40ba-a3d8-83f8bcf814cd",
			page: 1,
			perPage: 10,
			sortByCreatedAt: "desc",
		});

		expect(result.data).toBeDefined();
		console.log(result.data);
	});

	it.only("should sort attempts by points", async () => {
		const result = await queryAttempts({
			testId: "9bdc255f-5a89-40ba-a3d8-83f8bcf814cd",
			page: 1,
			perPage: 10,
			sortByPoints: "desc",
		});

		expect(result.data).toBeDefined();
		console.log(result.data);
	});
});
