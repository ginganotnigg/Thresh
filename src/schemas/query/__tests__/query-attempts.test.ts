import { queryAttempts } from "../attempts";

describe("Query Attempts", () => {

	it("should return attempts with correct structure", async () => {
		const result = await queryAttempts({
			testId: "42b8aa35-7ff9-4f5a-9fe7-89b9efa3b558",
			page: 1,
			perPage: 10,
		});

		expect(result).toHaveProperty("data");
		console.log(result.data);

	});
});
