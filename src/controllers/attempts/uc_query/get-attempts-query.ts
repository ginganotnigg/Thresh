import { QueryHandlerBase } from "../../shared/base/usecase.base";
import { AttemptsQuerySchemaType } from "../query.schema";
import { AttemptsResourceSchemaType } from "../resource.schema";

type GetAttemptsQueryParams = AttemptsQuerySchemaType;

type GetAttemptsQueryResult = AttemptsResourceSchemaType;

export class GetAttemptsQuery extends QueryHandlerBase<GetAttemptsQueryParams, GetAttemptsQueryResult> {
	async handle(params: GetAttemptsQueryParams): Promise<GetAttemptsQueryResult> {
	}
}