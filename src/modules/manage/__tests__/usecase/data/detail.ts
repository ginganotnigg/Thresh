import { TestDifficulty } from "../../../../../common/domain/enum";
import { DataDriven } from "../../../../../library/caymejs/test/data-driven.i";
import { TestResult } from "../../../schemas/response";

const detailData: DataDriven<number, Partial<TestResult> | null>[] = [
	{
		input: 1,
		expected: {
			id: 1,
			managerId: '1',
			title: 'Software Design Patterns Test',
			description: 'Understanding of software design patterns for best coding practices',
			minutesToAnswer: 20,
			difficulty: TestDifficulty.EASY,
			tags: ["Programming", "Algorithms"],
			answerCount: 2,
		}
	},
	{
		input: 0,
		expected: null
	}
];

export default detailData;