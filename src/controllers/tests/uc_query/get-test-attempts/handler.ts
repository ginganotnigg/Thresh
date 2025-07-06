import { queryAttempts } from "../../../../infrastructure/query/attempts";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetTestAttemptsQuery } from "./param";
import { GetTestAttemptsResponse } from "./response";

export class GetTestAttemptsQueryHandler extends QueryHandlerBase<GetTestAttemptsQuery, GetTestAttemptsResponse> {
	async handle(query: GetTestAttemptsQuery): Promise<GetTestAttemptsResponse> {
		const testId = this.getId();
		return await queryAttempts({ ...query, testId });
	}
}