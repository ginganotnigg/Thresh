import { Paged } from "../../../../controller/schemas/base";
import { TestDifficulty } from "../../../../domain/enum";
import { DataDriven } from "../../../../library/caymejs/test/data-driven.i";
import { TestFilterQuery } from "../../schemas/request";
import { TestItemResponse } from "../../schemas/response";

const getTestsData: DataDriven<TestFilterQuery, Paged<TestItemResponse> | undefined>[] = [
	// Full filter
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
		expected: undefined
	},
	// No filter
	{
		input: {
			page: 1,
			perPage: 5
		},
		expected: undefined
	}
];

export default getTestsData;