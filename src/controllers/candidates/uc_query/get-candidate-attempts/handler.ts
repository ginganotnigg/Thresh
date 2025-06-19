import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetCandidateAttemptsQuery } from "./param";
import { GetCandidateAttemptsResponse } from "./response";

export class GetCandidateAttemptsHandler extends QueryHandlerBase<GetCandidateAttemptsQuery, GetCandidateAttemptsResponse> {
	async handle(query: GetCandidateAttemptsQuery): Promise<GetCandidateAttemptsResponse> {

	}
}