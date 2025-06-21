import { Router, Response } from "express";
import { AsyncCallbackExpressHandler, FullSchema, HttpMethod, RequestSchema } from "../utils/type";
import { IChuoiMiddleware, IChuoiExceptionHandler, ChuoiPipeBase, ChuoiGuardBase } from "./contracts";
import { ChuoiContainer } from "../utils/container";
import { zodParse } from "../utils/schema-zod";
import { Constructor, CallbackExpressHandler, CallbackDataHandler, RequestData, MetaRequest as MetadataRequest } from "../utils/type";
import { z } from "zod";
import { ChuoiDocument } from "../documentation/open-api";
import { ChuoiSecurityBase } from "../documentation/security";


export class ChuoiRouter {
	private readonly _router: Router;
	private readonly _parentChuoiRouter?: ChuoiRouter;
	private readonly _path?: string;
	private readonly _middlewares: Constructor<IChuoiMiddleware>[] = [];
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

	middleware(...handler: Constructor<IChuoiMiddleware>[]) {
		this._middlewares.push(...handler);
		return this;
	}

	error(errorHandler: Constructor<IChuoiExceptionHandler>) {
		this._errorHandler = errorHandler;
		return this;
	}

	endpoint() {
		return new ChuoiEndpointBuilder(this.fullPath(), this._router).endpoint();
	}
}

class ChuoiEndpointBuilder {
	constructor(
		private readonly basePath: string,
		private readonly router: Router
	) { }

	private path: string;
	private method: "get" | "post" | "put" | "delete" | "patch" | "options" | "head" | "trace";
	private securities?: string[] = undefined;
	private middlewares: Constructor<IChuoiMiddleware>[] = [];
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

	public endpoint() {
		return {
			get: (path: string = "") => this._createMethod("get", path),
			post: (path: string = "") => this._createMethod("post", path),
			put: (path: string = "") => this._createMethod("put", path),
			delete: (path: string = "") => this._createMethod("delete", path),
			patch: (path: string = "") => this._createMethod("patch", path),
			options: (path: string = "") => this._createMethod("options", path),
			head: (path: string = "") => this._createMethod("head", path),
			trace: (path: string = "") => this._createMethod("trace", path),
		}
	}

	// **************************
	// Method chaining:
	// + Those with using call back function must be used with .bind(_this) to keep the context
	// **************************

	private _createMethod(method: HttpMethod, path: string) {
		this.path = path;
		this.method = method;
		return this._methodNext();
	}

	private _methodNext() {
		const _this = this;
		return {
			addSecurityDocument: <TScheme extends string>(security: ChuoiSecurityBase<TScheme>, key: TScheme) => _this._addSecurity(security, key),
			addGuard: (handler: Constructor<ChuoiGuardBase>) => _this._addGuard(handler),
			addPipe: <TMetaNew extends object>(handler: Constructor<ChuoiPipeBase<TMetaNew>>) => _this._addPipe<{}, TMetaNew>(handler),
			middleware: (...handlers: Constructor<IChuoiMiddleware>[]) => _this._middleware<{}>(...handlers),
			schema: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(schema: FullSchema<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this._schema(schema),
			before: <TParams, TQuery, TBody, THeader, TMeta>(handler: (data: RequestData<TParams, TQuery, TBody, THeader, TMeta>) => RequestData<TParams, TQuery, TBody, THeader, TMeta> | Promise<RequestData<TParams, TQuery, TBody, THeader, TMeta>>) => _this._before(handler),
			handle: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this._handle(handler),
		}
	}

	private _methodSecurity() {
		const _this = this;
		return {
			addSecurityDocument: <TScheme extends string>(security: ChuoiSecurityBase<TScheme>, key: TScheme) => _this._addSecurity(security, key),
			addGuard: (handler: Constructor<ChuoiGuardBase>) => _this._addGuard(handler),
			addPipe: <TMetaNew extends object>(handler: Constructor<ChuoiPipeBase<TMetaNew>>) => _this._addPipe<{}, TMetaNew>(handler),
			middleware: (...handlers: Constructor<IChuoiMiddleware>[]) => _this._middleware<{}>(...handlers),
			schema: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(schema: FullSchema<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this._schema(schema),
			before: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler: (data: RequestData<TParams, TQuery, TBody, THeader, TMeta>) => RequestData<TParams, TQuery, TBody, THeader, TMeta> | Promise<RequestData<TParams, TQuery, TBody, THeader, TMeta>>) => _this._before(handler),
			handle: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this._handle(handler),
		}
	}

	private _methodGuard() {
		const _this = this;
		return {
			addSecurity: <TScheme extends string>(security: ChuoiSecurityBase<TScheme>, key: TScheme) => _this._addSecurity(security, key),
			addGuard: (handler: Constructor<ChuoiGuardBase>) => _this._addGuard(handler),
			addPipe: <TMetaNew extends object>(handler: Constructor<ChuoiPipeBase<TMetaNew>>) => _this._addPipe<{}, TMetaNew>(handler),
			middleware: (...handlers: Constructor<IChuoiMiddleware>[]) => _this._middleware<{}>(...handlers),
			schema: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(schema: FullSchema<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this._schema(schema),
			before: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler: (data: RequestData<TParams, TQuery, TBody, THeader, TMeta>) => RequestData<TParams, TQuery, TBody, THeader, TMeta> | Promise<RequestData<TParams, TQuery, TBody, THeader, TMeta>>) => _this._before(handler),
			handle: <TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this._handle(handler),
		}
	}

	private _methodPipe<TMeta extends object>() {
		const _this = this;
		return {
			addPipe: <TMetaNew extends object>(handler: Constructor<ChuoiPipeBase<TMetaNew>>) => _this._addPipe<TMeta, TMetaNew>(handler),
			middleware: (...handlers: Constructor<IChuoiMiddleware>[]) => _this._middleware<TMeta>(...handlers),
			schema: <TParams, TQuery, TBody, THeader, TResponse>(schema: FullSchema<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this._schema(schema),
			before: <TParams, TQuery, TBody, THeader>(handler: (data: RequestData<TParams, TQuery, TBody, THeader, TMeta>) => RequestData<TParams, TQuery, TBody, THeader, TMeta> | Promise<RequestData<TParams, TQuery, TBody, THeader, TMeta>>) => _this._before(handler),
			handle: <TParams, TQuery, TBody, THeader, TResponse>(handler: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this._handle(handler),
		}
	}

	private _methodMiddleware<TMeta extends object>() {
		const _this = this;
		return {
			schema: <TParams, TQuery, TBody, THeader, TResponse>(schema: FullSchema<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this._schema<TParams, TQuery, TBody, THeader, TMeta, TResponse>(schema),
			before: <TParams, TQuery, TBody, THeader, TResponse>(handler: (data: RequestData<TParams, TQuery, TBody, THeader, TMeta>) => RequestData<TParams, TQuery, TBody, THeader, TMeta> | Promise<RequestData<TParams, TQuery, TBody, THeader, TMeta>>) => _this._before<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler),
			handle: <TParams, TQuery, TBody, THeader, TResponse>(handler: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this._handle<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler),
		}
	}

	private _methodSchema<TParams, TQuery, TBody, THeader, TMeta, TResponse>() {
		const _this = this;
		return {
			before: (handler: (data: RequestData<TParams, TQuery, TBody, THeader, TMeta>) => RequestData<TParams, TQuery, TBody, THeader, TMeta> | Promise<RequestData<TParams, TQuery, TBody, THeader, TMeta>>) => _this._before<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler),
			handle: (handler: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this._handle<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler),
		}
	}

	private _methodBefore<TParams, TQuery, TBody, THeader, TMeta, TResponse>() {
		const _this = this;
		return {
			handle: (handler: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) => _this._handle<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler),
		}
	}

	private _methodHandle<TResponse>() {
		const _this = this;
		return {
			after: (handler: (result: TResponse, res: Response) => void | Promise<void>) => _this._after<TResponse>(handler),
			error: _this._error.bind(_this),
			build: _this.build.bind(_this),
		}
	}

	private _methodAfter() {
		const _this = this;
		return {
			error: _this._error.bind(_this),
			build: _this.build.bind(_this),
		}
	}

	private _methodError() {
		const _this = this;
		return {
			build: _this.build.bind(_this),
		}
	}


	/* 
	 **********************************************
	 * Setter part
	 **********************************************
	 */

	private _addSecurity<TScheme extends string>(security: ChuoiSecurityBase<TScheme>, key: TScheme) {
		if (!this.securities) {
			this.securities = [];
		}
		this.securities.push(key);
		return this._methodSecurity();
	}

	private _addGuard(handler: Constructor<ChuoiGuardBase>) {
		this.middlewares.push(handler);
		return this._methodGuard();
	}

	private _addPipe<TMetaCurrent extends object, TMetaNew extends object>(handler: Constructor<ChuoiPipeBase<TMetaNew>>) {
		this.middlewares.push(handler);
		return this._methodPipe<TMetaCurrent & TMetaNew>();
	}

	private _middleware<TMeta extends object>(...handlers: Constructor<IChuoiMiddleware>[]) {
		this.middlewares.push(...handlers);
		return this._methodMiddleware<TMeta>();
	}

	private _schema<TParams, TQuery, TBody, THeader, TMeta, TResponse>(schema: FullSchema<TParams, TQuery, TBody, THeader, TMeta, TResponse>) {
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

	private _before<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler: (data: RequestData<TParams, TQuery, TBody, THeader, TMeta>) => RequestData<TParams, TQuery, TBody, THeader, TMeta> | Promise<RequestData<TParams, TQuery, TBody, THeader, TMeta>>) {
		this.beforeHandler = handler;
		return this._methodBefore<TParams, TQuery, TBody, THeader, TMeta, TResponse>();
	}

	private _handle<TParams, TQuery, TBody, THeader, TMeta, TResponse>(handler: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) {
		this.mainHandler = handler;
		return this._methodHandle<TResponse>();
	}

	private _after<TResponse>(handler: (result: TResponse, res: Response) => void | Promise<void>) {
		this.afterHandler = handler;
		return this._methodAfter();
	}

	private _error(handler: Constructor<IChuoiExceptionHandler>) {
		this.errorHandler = handler;
		return this._methodError();
	}

	/* 
	 **********************************************
	 * Handle part
	 **********************************************
	 */

	private _handleWarpped: AsyncCallbackExpressHandler = async (req, res, next) => {
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
				params = sParams ? zodParse(sParams, params) : params;
				query = sQuery ? zodParse(sQuery, query) : query;
				body = sBody ? zodParse(sBody, body) : body;
				headers = sHeaders ? zodParse(sHeaders, headers) : headers;
				meta = sMeta ? zodParse(sMeta, meta) : meta;
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

	// **************************
	// Build the endpoint
	// **************************

	private build({
		summary,
		description,
		tags,
	}: {
		summary?: string;
		description?: string;
		tags?: string[];
	} = {}): void {
		const _this = this;
		this.router[this.method](
			this.path,
			...this.middlewares.map(
				m => {
					const instance = ChuoiContainer.retrieve(m);
					return instance.handle.bind(instance);
				}
			),
			(req, res, next) => _this._handleWarpped(req, res, next),
		);
		if (this.errorHandler) {
			const instance = ChuoiContainer.retrieve(this.errorHandler);
			this.router.use(instance.handle.bind(instance));
		}

		ChuoiDocument.addEndpointDocumentation(
			this.basePath + this.path,
			this.method,
			this.requestSchema,
			this.responseSchema,
			summary,
			description,
			tags,
			this.securities
		);
	}
}


