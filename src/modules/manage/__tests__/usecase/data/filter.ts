import { TestDifficulty } from "../../../../../common/domain/enum";
import { DataDriven } from "../../../../../common/test/data-driven.i";
import { TestFilterParam } from "../../../schemas/param";

const filterData: DataDriven<TestFilterParam, { length: number }>[] = [
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