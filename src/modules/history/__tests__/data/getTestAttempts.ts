import { Paged } from "../../../../common/controller/schemas/base";
import { AttemptFilterQuery } from "../../schemas/request";
import { DataDriven } from "../../../../library/caymejs/test/data-driven.i";
import { AttemptItemResult } from "../../schemas/response";

export const getTestAttempts: DataDriven<{ query: AttemptFilterQuery } & { testId: number }, Paged<AttemptItemResult> | undefined>[] = [
	// Full filter
	{
		input: {
			testId: 1,
			query: {
				sortByStartDate: "asc",
				sortByScore: "asc",
				page: 1,
				perPage: 5,
			}
		},
		expected: undefined
	},
	// No filter
	{
		input: {
			testId: 1,
			query: {
				page: 1,
				perPage: 5,
			}
		},
		expected: undefined
	},
];