import { DomainError } from "../errors/domain.error";
import { PolicyError } from "../errors/policy.error";
import { CredentialsBase } from "../policy/types";
import { CredentialsMeta } from "../schemas/meta";


abstract class UseCaseBase<TParams, TResult, TId = string> {
	private _credentials: CredentialsBase | undefined = undefined;
	private _id: TId | undefined = undefined;

	withCredentials(credentials?: CredentialsMeta): this {
		if (!credentials || !credentials.userId || !credentials.role) {
			return this;
		}
		this._credentials = {
			role: credentials.role,
			userId: credentials.userId,
		};
		return this;
	}

	withId(id: TId): this {
		this._id = id;
		return this;
	}

	abstract handle(params: TParams): Promise<TResult>;

	protected getCredentials(): CredentialsBase {
		if (!this._credentials) {
			throw new PolicyError("Credentials are required for this operation.");
		}
		return this._credentials;
	}

	protected getId(): TId {
		if (!this._id) {
			throw new DomainError("ID is required for this operation.");
		}
		return this._id;
	}
}

export abstract class QueryHandlerBase<TParams, TResult extends object> extends UseCaseBase<TParams, TResult> {

}

export abstract class CommandHandlerBase<TParams, TResult = void> extends UseCaseBase<TParams, TResult> {

}