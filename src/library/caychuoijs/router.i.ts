import { Application, Response, Router } from "express";
import { Constructor, CallbackExpressHandler, RequestData, MetaRequest as MetadataRequest, CallbackDataHandler } from "./utils/type";
import { ChuoiContainer } from "./utils/container";
import { IChuoiHandler, ISchemaValidator } from "./contracts";
import { ClassValidatorSchemaValidator } from "./utils/schema-validator"

export class ChuoiController {
	private static _globalRouter?: ChuoiRouter;

	static init(app: Application, config: {
		basePath: string,
	}): void {
		const router = Router();
		app.use(config.basePath, router);
		this._globalRouter = new ChuoiRouter(router, config.basePath);
	}

	static router(): ChuoiRouter {
		if (!this._globalRouter) {
			throw new Error("ChuoiController not initialized");
		}
		return this._globalRouter;
	}
}

class ChuoiRouter {
	private readonly _router: Router;
	private readonly _children: ChuoiRouter[] = [];
	private readonly _validator: ISchemaValidator;

	constructor(router: Router, routerPath?: string) {
		this._router = Router();
		if (routerPath) {
			router.use(routerPath, this._router);
		}
		else {
			router.use(this._router);
		}
		this._validator = ChuoiContainer.retrieve(ClassValidatorSchemaValidator);
	}

	down(childPath?: string) {
		const child = new ChuoiRouter(this._router, childPath);
		this._children.push(child);
		return child;
	}

	handler(...handler: Constructor<IChuoiHandler>[]) {
		if (handler) {
			this._router.use(...handler.map(h => ChuoiContainer.retrieve(h).handle));
		}
		return this;
	}

	endpoint() {
		const __instance = this;
		let _method: "get" | "post" | "put" | "delete" | "patch" | "options" | "head" | "connect" | "trace" = "get";
		let _path = '';
		let beforeHandlers: CallbackExpressHandler[] = [];
		let afterHandlers: CallbackExpressHandler[] = [];
		let mainHandler: CallbackDataHandler<any, any, any, any, any, any> = () => { };
		let afterHandler: (result: any, res: Response) => void = (result, res) => {
			let statusCode = 200;
			switch (_method) {
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
			if (result instanceof Promise) {
				result.then(r => res.status(statusCode).json(r));
			}
			else {
				res.status(statusCode).json(result);
			}
		};

		function schema<
			TParams extends Record<string, any>,
			TQuery extends Record<string, any>,
			TBody extends Record<string, any>,
			THeader extends Record<string, any>,
			TMeta extends Record<string, any>,
		>(
			{
				params,
				query,
				body,
				headers,
				meta,
			}: {
				params?: Constructor<TParams>,
				query?: Constructor<TQuery>,
				body?: Constructor<TBody>,
				headers?: Constructor<THeader>,
				meta?: Constructor<TMeta>,
			} = {}
		) {
			return {
				handle<TResponse extends Record<string, any>>(callback: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>) {
					mainHandler = (data: RequestData<TParams, TQuery, TBody, THeader, TMeta>) => {
						const parsedParams = params ? __instance._validator.validate(data.params, params) : {} as TParams;
						const parsedQuery = query ? __instance._validator.validate(data.query, query) : {} as TQuery;
						const parsedBody = body ? __instance._validator.validate(data.body, body) : {} as TBody;
						const parsedHeaders = headers ? __instance._validator.validate(data.headers, headers) : {} as THeader;
						const parsedMeta = meta ? __instance._validator.validate(data.meta, meta) : {} as TMeta;
						const result = callback({
							params: parsedParams,
							query: parsedQuery,
							body: parsedBody,
							headers: parsedHeaders,
							meta: parsedMeta,
						});
						return result;
					};
					return {
						build,
						after: (handler: (result: TResponse, res: Response) => void) => {
							afterHandler = handler;
							return { build };
						},
					};
				}
			}
		}

		function build() {
			const mainCallback: CallbackExpressHandler = async (req, res, next) => {
				const metaData = (req as MetadataRequest)?.meta || {};
				const data = {
					params: req.params,
					query: req.query,
					body: req.body,
					headers: req.headers,
					meta: metaData
				};
				try {
					const result = await mainHandler(data);
					afterHandler(result, res);
				} catch (error) {
					next(error);
				}
			};
			__instance._router[_method](_path,
				...beforeHandlers,
				mainCallback,
				...afterHandlers
			);
		}

		const _handler = {
			before: (...handlers: Constructor<IChuoiHandler>[]) => {
				beforeHandlers = handlers.map(h => ChuoiContainer.retrieve(h).handle);
				return { schema };
			},
			schema,

		};

		const _switch = {
			get(path: string) {
				_method = "get";
				_path = path;
				return _handler;
			},
			post(path: string) {
				_method = "post";
				_path = path;
				return _handler;
			},
			put(path: string) {
				_method = "put";
				_path = path;
				return _handler;
			},
			delete(path: string) {
				_method = "delete";
				_path = path;
				return _handler;
			},
			patch(path: string) {
				_method = "patch";
				_path = path;
				return _handler;
			},
			options(path: string) {
				_method = "options";
				_path = path;
				return _handler;
			},
			head(path: string) {
				_method = "head";
				_path = path;
				return _handler;
			},
			connect(path: string) {
				_method = "connect";
				_path = path;
				return _handler;
			},
			trace(path: string) {
				_method = "trace";
				_path = path;
				return _handler;
			}
		}

		return _switch;
	}
}

const router = new ChuoiRouter(Router(), "/api");
export { router };