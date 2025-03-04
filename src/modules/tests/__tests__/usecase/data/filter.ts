import { TestDifficulty } from "../../../../../common/domain/enum";
import { DataDriven } from "../../../../../library/caymejs/test/data-driven.i";
import { TestFilterQuery } from "../../../schemas/request";

const filterData: DataDriven<TestFilterQuery, { length: number }>[] = [
	// Apply all filters
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
			length: 3
		}
	},
	// No filter
	{
		input: {
			page: 1,
			perPage: 5
		},
		expected: {
			length: 12
		}
	}
];

export default filterData;