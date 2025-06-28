import { buildTestQuery, parseResult } from "../../../../schemas/build/build-test-query";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetSuggestedTestsQuery } from "./param";
import { GetSuggestedTestsResponse } from "./response";

export class GetSuggestedTestsQueryHandler extends QueryHandlerBase<GetSuggestedTestsQuery, GetSuggestedTestsResponse> {
	async handle(param: GetSuggestedTestsQuery): Promise<GetSuggestedTestsResponse> {
		const {
			numberOfTests
		} = param;

		const { userId } = this.getCredentials();

		// Suggest tests with no attempts
		let query = buildTestQuery();
		query = query
			.where("t.authorId", "=", userId)
			.where("t.mode", "=", "PRACTICE")
			.where("totalAttempts", "=", 0)
			.orderBy("t.updatedAt", "desc")
			.limit(numberOfTests); // Default to 10 if not specified
		;
		const res = await query.execute();
		const numberOfTestsLeft = numberOfTests - res.length;
		if (numberOfTestsLeft > 0) {
			let query2 = buildTestQuery();
			query2 = query2
				.where("t.authorId", "=", userId)
				.where("t.mode", "=", "PRACTICE")
				.orderBy("averageScore", "asc")
				.orderBy("t.updatedAt", "desc")
				.limit(numberOfTestsLeft);
			const lowScoreTests = await query.execute();
			res.push(...lowScoreTests);
		}

		return res.map(raw => parseResult(raw, [], false));
	}
}