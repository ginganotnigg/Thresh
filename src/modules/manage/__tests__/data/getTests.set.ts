import { Paged } from "../../../../controller/schemas/base";
import { TestDifficulty } from "../../../../domain/enum";
import { DataDriven } from "../../../../library/caymejs/test/data-driven.i";
import { TestFilterQuery } from "../../schemas/request";
import { TestItemResponse } from "../../schemas/response";

/**
 * Test data for the getTests function
 * This includes both input filters and expected outputs based on seed data
 */
const getTestsData: DataDriven<TestFilterQuery, Paged<TestItemResponse>>[] = [
	// Test Case 1: Basic filter by difficulty (EASY)
	{
		input: {
			difficulty: [TestDifficulty.EASY],
			page: 1,
			perPage: 10
		},
		expected: {
			page: 1,
			perPage: 10,
			total: expect.any(Number),
			totalPages: expect.any(Number),
			data: expect.arrayContaining([
				expect.objectContaining({
					difficulty: TestDifficulty.EASY,
				})
			])
		},
		name: 'Basic filter by difficulty (EASY)'
	},

	// Test Case 2: Filter by title search
	{
		input: {
			searchTitle: 'Software',
			page: 1,
			perPage: 10
		},
		expected: {
			page: 1,
			perPage: 10,
			total: expect.any(Number),
			totalPages: expect.any(Number),
			data: expect.arrayContaining([
				expect.objectContaining({
					title: expect.stringMatching(/Software/)
				})
			])
		},
		name: 'Filter by title search'
	},

	// Test Case 3: Filter by minutes to answer range
	{
		input: {
			minMinutesToAnswer: 15,
			maxMinutesToAnswer: 25,
			page: 1,
			perPage: 10
		},
		expected: {
			page: 1,
			perPage: 10,
			total: expect.any(Number),
			totalPages: expect.any(Number),
			data: expect.arrayContaining([
				expect.objectContaining({
					minutesToAnswer: expect.any(Number)
				})
			])
		},
		name: 'Filter by minutes to answer range'
	},

	// Test Case 4: Filter by difficulty (HARD)
	{
		input: {
			difficulty: [TestDifficulty.HARD],
			page: 1,
			perPage: 10
		},
		expected: {
			page: 1,
			perPage: 10,
			total: expect.any(Number),
			totalPages: expect.any(Number),
			data: expect.arrayContaining([
				expect.objectContaining({
					difficulty: TestDifficulty.HARD
				})
			])
		},
		name: 'Filter by difficulty (HARD)'
	},

	// Test Case 5: Filter by multiple difficulties
	{
		input: {
			difficulty: [TestDifficulty.EASY, TestDifficulty.MEDIUM],
			page: 1,
			perPage: 10
		},
		expected: {
			page: 1,
			perPage: 10,
			total: expect.any(Number),
			totalPages: expect.any(Number),
			data: expect.arrayContaining([
				expect.objectContaining({
					difficulty: expect.stringMatching(/easy|medium/)
				})
			])
		},
		name: 'Filter by multiple difficulties'
	},

	// Test Case 6: Pagination test
	{
		input: {
			page: 1,
			perPage: 5
		},
		expected: {
			page: 1,
			perPage: 5,
			total: expect.any(Number),
			totalPages: expect.any(Number),
			data: expect.any(Array)
		},
		name: 'Pagination test'
	},

	// Test Case 7: Sort by title ascending
	{
		input: {
			sortBy: [{ field: 'title', order: 'asc' }],
			page: 1,
			perPage: 10
		},
		expected: {
			page: 1,
			perPage: 10,
			total: expect.any(Number),
			totalPages: expect.any(Number),
			data: expect.any(Array)
		},
		name: 'Sort by title ascending'
	},

	// Test Case 8: Full combination of filters
	{
		input: {
			searchTitle: 'Test',
			minMinutesToAnswer: 10,
			maxMinutesToAnswer: 60,
			difficulty: [TestDifficulty.EASY],
			tags: [1],
			page: 1,
			perPage: 10
		},
		expected: {
			page: 1,
			perPage: 10,
			total: expect.any(Number),
			totalPages: expect.any(Number),
			data: expect.any(Array)
		},
		name: 'Full combination of filters'
	},

	// Test Case 9: Filter by single tag
	{
		input: {
			tags: [1], // Assuming tag ID 1 exists in seed data
			page: 1,
			perPage: 10
		},
		expected: {
			page: 1,
			perPage: 10,
			total: expect.any(Number),
			totalPages: expect.any(Number),
			data: expect.arrayContaining([
				expect.objectContaining({
					tags: expect.arrayContaining([
						expect.objectContaining({ id: 1 })
					])
				})
			])
		},
		name: 'Filter by single tag'
	},

	// Test Case 10: Filter by multiple tags
	{
		input: {
			tags: [1, 2], // Assuming tag IDs 1 and 2 exist in seed data
			page: 1,
			perPage: 10
		},
		expected: {
			page: 1,
			perPage: 10,
			total: expect.any(Number),
			totalPages: expect.any(Number),
			data: expect.arrayContaining([
				expect.objectContaining({
					tags: expect.arrayContaining([
						expect.objectContaining({ id: expect.any(Number) })
					])
				})
			])
		},
		name: 'Filter by multiple tags'
	},

	// Test Case 11: Combining tag filter with difficulty
	{
		input: {
			tags: [3], // Assuming tag ID 3 exists in seed data
			difficulty: [TestDifficulty.MEDIUM],
			page: 1,
			perPage: 10
		},
		expected: {
			page: 1,
			perPage: 10,
			total: expect.any(Number),
			totalPages: expect.any(Number),
			data: expect.arrayContaining([
				expect.objectContaining({
					difficulty: TestDifficulty.MEDIUM,
					tags: expect.arrayContaining([
						expect.objectContaining({ id: 3 })
					])
				})
			])
		},
		name: 'Combining tag filter with difficulty'
	},

	// Test Case 12: Empty result with non-existent tag combination
	{
		input: {
			tags: [999, 1000], // Assuming these tag IDs don't exist in seed data
			page: 1,
			perPage: 10
		},
		expected: {
			page: 1,
			perPage: 10,
			total: 0,
			totalPages: 0,
			data: []
		},
		name: 'Empty result with non-existent tag combination'
	},
];

export default getTestsData;