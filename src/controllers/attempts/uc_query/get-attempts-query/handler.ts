import { db } from "../../../../configs/orm/kysely/db";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetAttemptsQueryParam } from "./param";
import { GetAttemptsResourceResponse } from "./response";
import { paginate } from "../../../../shared/handler/query";
import { queryAttempts } from "../../../../infrastructure/query/attempts";

export class GetAttemptsQueryHandler extends QueryHandlerBase<GetAttemptsQueryParam, GetAttemptsResourceResponse> {
	async handle(params: GetAttemptsQueryParam): Promise<GetAttemptsResourceResponse> {
		return queryAttempts(params);
	}
}
