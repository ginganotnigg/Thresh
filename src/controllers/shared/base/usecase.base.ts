import { CredentialsMeta } from "../schemas/meta";

abstract class UseCaseBase<TParams, TResult> {
	private _credentials: CredentialsMeta | undefined = undefined;
	private _id: string | undefined = undefined;

	withCredentials(credentials: CredentialsMeta): this {
		this._credentials = credentials;
		return this;
	}

	withId(id: string): this {
		this._id = id;
		return this;
	}

	abstract handle(params: TParams): Promise<TResult>;

	protected getCredentials(): CredentialsMeta {
		if (!this._credentials) {
			throw new Error("Credentials are required for this operation.");
		}
		return this._credentials;
	}

	protected getId(): string {
		if (!this._id) {
			throw new Error("ID is required for this operation.");
		}
		return this._id;
	}
}

export abstract class QueryHandlerBase<TParams, TResult extends object> extends UseCaseBase<TParams, TResult> {

}

export abstract class CommandHandlerBase<TParams, TResult = void> extends UseCaseBase<TParams, TResult> {

}