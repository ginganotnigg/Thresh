import { CredentialsMeta } from "../../../controllers/shared/schemas/meta";

export abstract class QueryBase<TParam, TResponse> {
	abstract query(param: TParam): Promise<TResponse>;
}

export abstract class QueryWithCredentialsBase<TParam, TResponse> extends QueryBase<TParam, TResponse> {
	constructor(
		protected readonly credentials: CredentialsMeta,
	) { super(); }
}