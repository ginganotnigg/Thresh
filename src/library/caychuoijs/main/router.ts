import { Router, Response } from "express";
import { FullSchema, HttpMethod, RequestSchema } from "../utils/type";
import { IChuoiHandler, IChuoiExceptionHandler } from "./contracts";
import { ChuoiContainer } from "../utils/container";
import { zodParse } from "../utils/schema-zod";
import { Constructor, CallbackExpressHandler, CallbackDataHandler, RequestData, MetaRequest as MetadataRequest } from "../utils/type";
import { z } from "zod";
import { ChuoiDocument } from "../documentation/open-api";


export class ChuoiRouter {
	private readonly _router: Router;
	private readonly _parentChuoiRouter?: ChuoiRouter;
	private readonly _path?: string;
	private readonly _middlewares: Constructor<IChuoiHandler>[] = [];
	private _errorHandler?: Constructor<IChuoiExceptionHandler>;

	constructor(parrentChuoiRouter: ChuoiRouter | Router, routerPath?: string) {
		if (parrentChuoiRouter instanceof ChuoiRouter) {
			this._parentChuoiRouter = parrentChuoiRouter;
			this._router = Router();
		} else {
			this._router = parrentChuoiRouter;
		}
		this._path = routerPath;
	}

	fullPath() {
		const _fullPath = (chuoiRouter: ChuoiRouter): string => {
			if (chuoiRouter._path && chuoiRouter._parentChuoiRouter) {
				return _fullPath(chuoiRouter._parentChuoiRouter) + chuoiRouter._path;
			}
			return "";
		}
		return _fullPath(this);
	}

	down(childPath?: string) {
		const child = new ChuoiRouter(this, childPath);
		const mdwHandlers = this._middlewares.map(m => ChuoiContainer.retrieve(m).handle);
		const errHandler = this._errorHandler ? ChuoiContainer.retrieve(this._errorHandler).handle : undefined;
		if (childPath) {
			this._router.use(
				childPath,
				...mdwHandlers,
				child._router
			);
			if (errHandler) {
				this._router.use(childPath, errHandler);
			}
		} else {
			this._router.use(child._router, ...mdwHandlers);
			if (errHandler) {
				this._router.use(errHandler);
			}
		}
		return child;
	}

	middleware(...handler: Constructor<IChuoiHandler>[]) {
		this._middlewares.push(...handler);
		return this;
	}

	error(errorHandler: Constructor<IChuoiExceptionHandler>) {
		this._errorHandler = errorHandler;
		return this;
	}

	endpoint() {
		return new ChuoiEndpoint(this.fullPath(), this._router).endpoint();
	}
}

class ChuoiEndpoint {
	constructor(
		private readonly basePath: string,
		private readonly router: Router
	) { }

	private path: string;
	private method: "get" | "post" | "put" | "delete" | "patch" | "options" | "head" | "trace";
	private middlewares: Constructor<IChuoiHandler>[] = [];
	private errorHandler: Constructor<IChuoiExceptionHandler> | undefined;
	private requestSchema: RequestSchema<any, any, any, any, any> | undefined;
	private responseSchema: z.ZodType<any> | undefined;
	private beforeHandler?: (data: RequestData<any, any, any, any, any>) => RequestData<any, any, any, any, any> | Promise<RequestData<any, any, any, any, any>>;
	private mainHandler: CallbackDataHandler<any, any, any, any, any, any>;
	private afterHandler?: (result: any, res: Response) => void | Promise<void> = async (result, res) => {
		let statusCode = 200;
		switch (this.method) {
			case "post":
				statusCode = 201;
				break;
			case "put":
			case "patch":
				statusCode = 204;
				break;
			case "delete":
				statusCode = 204;
				break;
			default:
				statusCode = 200;
				break;
		}
		if (result instanceof Object) {
			res.status(statusCode).send(result);
		}
		else {
			res.status(statusCode).json(result);
		}
	};

	// **************************
	// Method chaining:
	// + Those with using call back function must be used with .bind(_this) to keep the context
	// **************************

	private _methodNext() {
		const _this = this;
		return {
			middleware: _this.middleware.bind(_this),
			schema: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(schema: FullSchema<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this.schema(schema),
			before: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler: (data: RequestData<TParams, TQuery, TBody, THeader, TMeta>) => RequestData<TParams, TQuery, TBody, THeader, TMeta> | Promise<RequestData<TParams, TQuery, TBody, THeader, TMeta>>) => _this.before(handler),
			handle: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this.handle(handler),
		}
	}

	private _methodMiddleware() {
		const _this = this;
		return {
			schema: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(schema: FullSchema<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this.schema<TParams, TQuery, TBody, THeader, TMeta, TResponse>(schema),
			before: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler: (data: RequestData<TParams, TQuery, TBody, THeader, TMeta>) => RequestData<TParams, TQuery, TBody, THeader, TMeta> | Promise<RequestData<TParams, TQuery, TBody, THeader, TMeta>>) => _this.before<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler),
			handle: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this.handle<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler),
		}
	}

	private _methodSchema<TParams, TQuery, TBody, THeader, TMeta, TResponse>() {
		const _this = this;
		return {
			before: (handler: (data: RequestData<TParams, TQuery, TBody, THeader, TMeta>) => RequestData<TParams, TQuery, TBody, THeader, TMeta> | Promise<RequestData<TParams, TQuery, TBody, THeader, TMeta>>) => _this.before<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler),
			handle: (handler: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this.handle<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler),
		}
	}

	private _methodBefore<TParams, TQuery, TBody, THeader, TMeta, TResponse>() {
		const _this = this;
		return {
			handle: (handler: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this.handle<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler),
		}
	}

	private _methodHandle<TResponse>() {
		const _this = this;
		return {
			after: (handler: (result: TResponse, res: Response) => void | Promise<void>) => _this.after<TResponse>(handler),
			error: _this.error.bind(_this),
			build: _this.build.bind(_this),
		}
	}

	private _methodAfter() {
		const _this = this;
		return {
			error: _this.error.bind(_this),
			build: _this.build.bind(_this),
		}
	}

	private _methodError() {
		const _this = this;
		return {
			build: _this.build.bind(_this),
		}
	}

	public endpoint() {
		return {
			get: (path: string) => this.createMethod("get", path),
			post: (path: string) => this.createMethod("post", path),
			put: (path: string) => this.createMethod("put", path),
			delete: (path: string) => this.createMethod("delete", path),
			patch: (path: string) => this.createMethod("patch", path),
			options: (path: string) => this.createMethod("options", path),
			head: (path: string) => this.createMethod("head", path),
			trace: (path: string) => this.createMethod("trace", path),
		}
	}

	private createMethod(method: HttpMethod, path: string) {
		this.path = path;
		this.method = method;
		return this._methodNext();
	}

	private middleware(...handlers: Constructor<IChuoiHandler>[]) {
		this.middlewares.push(...handlers);
		return this._methodMiddleware();
	}

	private schema<TParams, TQuery, TBody, THeader, TMeta, TResponse>(schema: FullSchema<TParams, TQuery, TBody, THeader, TMeta, TResponse>) {
		this.requestSchema = {
			params: schema.params,
			query: schema.query,
			body: schema.body,
			headers: schema.headers,
			meta: schema.meta
		};
		this.responseSchema = schema.response;
		return this._methodSchema<TParams, TQuery, TBody, THeader, TMeta, TResponse>();
	}

	private before<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler: (data: RequestData<TParams, TQuery, TBody, THeader, TMeta>) => RequestData<TParams, TQuery, TBody, THeader, TMeta> | Promise<RequestData<TParams, TQuery, TBody, THeader, TMeta>>) {
		this.beforeHandler = handler;
		return this._methodBefore<TParams, TQuery, TBody, THeader, TMeta, TResponse>();
	}

	private handle<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) {
		this.mainHandler = handler;
		return this._methodHandle<TResponse>();
	}

	private after<TResponse>(handler: (result: TResponse, res: Response) => void | Promise<void>) {
		this.afterHandler = handler;
		return this._methodAfter();
	}

	private error(handler: Constructor<IChuoiExceptionHandler>) {
		this.errorHandler = handler;
		return this._methodError();
	}

	private _handleWarpped: CallbackExpressHandler = async (req, res, next) => {
		try {
			const metaData = (req as MetadataRequest)?.meta || {};
			let { params, query, body, headers, meta } = {
				params: req.params as any,
				query: req.query as any,
				body: req.body as any,
				headers: req.headers as any,
				meta: metaData as any
			};
			if (this.requestSchema) {
				const {
					params: sParams,
					query: sQuery,
					body: sBody,
					headers: sHeaders,
					meta: sMeta
				} = this.requestSchema;
				params = sParams ? zodParse(sParams, params) : {};
				query = sQuery ? zodParse(sQuery, query) : {};
				body = sBody ? zodParse(sBody, body) : {};
				headers = sHeaders ? zodParse(sHeaders, headers) : {};
				meta = sMeta ? zodParse(sMeta, meta) : {};
			}
			let beforeHandlerResult = { params, query, body, headers, meta };
			if (this.beforeHandler) {
				beforeHandlerResult = await this.beforeHandler({ params, query, body, headers, meta });
			}
			const result = await this.mainHandler(beforeHandlerResult);
			const parsedResult = this.responseSchema ? zodParse(this.responseSchema, result) : result;
			if (this.afterHandler) {
				await this.afterHandler(parsedResult, res);
			}
		} catch (error) {
			next(error);
		}
	}

	private build({
		summary,
		description,
		tags,
	}: {
		summary?: string;
		description?: string;
		tags?: string[];
	} = {}): void {
		this.router[this.method](
			this.path,
			...this.middlewares.map(
				m => ChuoiContainer.retrieve(m).handle
			),
			this._handleWarpped
		);
		if (this.errorHandler) {
			this.router.use(ChuoiContainer.retrieve(this.errorHandler).handle);
		}

		ChuoiDocument.addEndpointDocumentation(
			this.basePath + this.path,
			this.method,
			this.requestSchema,
			this.responseSchema,
			summary,
			description,
			tags,
		);
	}
}


