import { setupAfterAll, setupBeforeAll } from "../../../tests/service-setup";
import { ManageQueryService } from "../services/manage.query.service";
import getTestsData from "./data/getTests.set";

describe("ManageQueryService - getTests", () => {
	let index = 0;

	beforeAll(async () => {
		await setupBeforeAll();
	});

	afterAll(async () => {
		await setupAfterAll();
	});

	it.each(getTestsData)('should filter tests according to input parameters', async (data) => {
		let capturedResult: any = null;
		try {
			index += 1;
			// if (index != 3) return;

			console.log(`Test case ${index}: ${data.name}`);
			const result = await ManageQueryService.getTests(data.input);
			capturedResult = result; // Capture the result for debugging

			// Basic validation for pagination structure
			expect(result).toHaveProperty('page', data.input.page);
			expect(result).toHaveProperty('perPage', data.input.perPage);
			expect(result).toHaveProperty('total');
			expect(result).toHaveProperty('totalPages');
			expect(result).toHaveProperty('data');

			// Verify array structure
			expect(Array.isArray(result.data)).toBe(true);

			// Verify that pagination makes sense
			expect(result.totalPages).toBe(Math.ceil(result.total / result.perPage));

			// Check specific filtering conditions
			if (data.input.difficulty) {
				// If filtering by difficulty, all returned tests should have matching difficulty
				for (const item of result.data) {
					if (Array.isArray(data.input.difficulty)) {
						expect(data.input.difficulty).toContain(item.difficulty);
					}
				}
			}

			if (data.input.searchTitle) {
				// If filtering by title, all returned tests should include the search term in their title
				for (const item of result.data) {
					expect(item.title.toLowerCase()).toContain(data.input.searchTitle.toLowerCase());
				}
			}

			if (data.input.minMinutesToAnswer !== undefined) {
				// If filtering by min minutes, all returned tests should have at least that many minutes
				for (const item of result.data) {
					expect(item.minutesToAnswer).toBeGreaterThanOrEqual(data.input.minMinutesToAnswer);
				}
			}

			if (data.input.maxMinutesToAnswer !== undefined) {
				// If filtering by max minutes, all returned tests should have at most that many minutes
				for (const item of result.data) {
					expect(item.minutesToAnswer).toBeLessThanOrEqual(data.input.maxMinutesToAnswer);
				}
			}

			if (data.input.sortBy && data.input.sortBy.length > 0) {
				const sorting = data.input.sortBy[0];
				if (sorting.field === 'title') {
					// Check if results are properly sorted by title
					for (let i = 0; i < result.data.length - 1; i++) {
						const current = result.data[i].title;
						const next = result.data[i + 1].title;

						if (sorting.order === 'asc') {
							expect(current <= next).toBe(true);
						} else {
							expect(current >= next).toBe(true);
						}
					}
				}
			}

			// Compare with expected test data
			if (data.expected) {
				expect(result.page).toEqual(data.expected.page);
				expect(result.perPage).toEqual(data.expected.perPage);

				if (typeof data.expected.total === 'number') {
					expect(result.total).toEqual(data.expected.total);
				}

				if (typeof data.expected.totalPages === 'number') {
					expect(result.totalPages).toEqual(data.expected.totalPages);
				}
			}
		} catch (error) {
			console.error(`Test case failed: "${data.name}"`);
			console.error("Error details:", error);
			console.error("Input data:", data.input);
			console.error("Expected data:", data.expected);
			console.error("Captured result:", capturedResult); // Log the captured result
			throw error; // Rethrow the error to fail the test
		}
	}, 10000);
});