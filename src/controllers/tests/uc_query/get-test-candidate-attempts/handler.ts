import { queryAttempts } from "../../../../infrastructure/query/attempts";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetTestCandidateAttemptsQuery } from "./param";
import { GetTestCandidateAttemptsResponse } from "./response";

export class GetTestCandidateAttemptsQueryHandler extends QueryHandlerBase<
	GetTestCandidateAttemptsQuery,
	GetTestCandidateAttemptsResponse,
	{ testId: string, candidateId: string }
> {
	async handle(param: GetTestCandidateAttemptsQuery): Promise<GetTestCandidateAttemptsResponse> {
		const { testId, candidateId } = this.getId();
		const { statusFilters, page, perPage } = param;
		const query = await queryAttempts({
			testId,
			candidateId,
			statusFilters,
			page,
			perPage,
		});
		return query;
	}
}