import { queryAttempts } from "../../../../schemas/query/attempts";
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
		const { status, page, perPage } = param;
		const query = await queryAttempts({
			testId,
			candidateId,
			status,
			page,
			perPage,
		});
		return query;
	}
}