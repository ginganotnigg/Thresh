import { TestDifficulty } from "../../../../../common/domain/enum";
import { DataDriven } from "../../../../../library/caymejs/test/data-driven.i";
import { TestFilterQuery } from "../../../schemas/request";

const managerData: DataDriven<TestFilterQuery & { managerId: string }, { length: number }>[] = [
	{
		input: {
			managerId: '1',
			page: 1,
			perPage: 10
		},
		expected: {
			length: 7
		}
	},
	{
		input: {
			managerId: '1',
			difficulty: [TestDifficulty.EASY, TestDifficulty.MEDIUM],
			page: 1,
			perPage: 10
		},
		expected: {
			length: 5
		}
	},
	{
		input: {
			managerId: '0',
			page: 1,
			perPage: 10
		},
		expected: {
			length: 0
		}
	}
];

export default managerData;