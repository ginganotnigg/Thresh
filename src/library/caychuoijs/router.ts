import { Router, Response } from "express";
import { RequestSchema } from "./utils/type";
import { IChuoiHandler, IChuoiExceptionHandler } from "./contracts";
import { ChuoiContainer } from "./utils/container";
import { zodParse } from "./utils/schema-zod";
import { Constructor, CallbackExpressHandler, CallbackDataHandler, RequestData, MetaRequest as MetadataRequest } from "./utils/type";
import { z } from "zod";
import { ChuoiDocument } from "./documentation/open-api";


export class ChuoiRouter {
	private readonly _realRouter: Router;
	private readonly _parent?: ChuoiRouter;

	constructor(realRouter: Router, parrent?: ChuoiRouter, routerPath?: string) {
		this._realRouter = Router();
		if (routerPath) {
			realRouter.use(routerPath, this._realRouter);
		}
		else {
			realRouter.use(this._realRouter);
		}
		this._parent = parrent;
	}

	down(childPath?: string) {
		const child = new ChuoiRouter(this._realRouter, this, childPath);
		return child;
	}

	handler(...handler: Constructor<IChuoiHandler>[]) {
		if (handler) {
			this._realRouter.use(...handler.map(h => ChuoiContainer.retrieve(h).handle));
		}
		return this;
	}

	errorHandler(errorHandler: IChuoiExceptionHandler) {
		this._realRouter.use(errorHandler.handle);
	}

	endpoint() {
		const __instance = this;
		let _method: "get" | "post" | "put" | "delete" | "patch" | "options" | "head" | "trace" = "get";
		let _path = '';
		let _reqSchema: RequestSchema<any, any, any, any, any> | undefined;
		let _resSchema: z.ZodObject<any> | undefined;
		let beforeHandlers: CallbackExpressHandler[] = [];
		let afterHandlers: CallbackExpressHandler[] = [];
		let mainHandler: CallbackDataHandler<any, any, any, any, any, any> = () => { };
		// Default response.
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
			TMeta extends Record<string, any>
		>(
			schema: RequestSchema<TParams, TQuery, TBody, THeader, TMeta> = {}
		) {
			const { params, query, body, headers, meta } = schema;
			_reqSchema = schema;
			return {
				handle<TResponse extends Record<string, any>>(callback: CallbackDataHandler<TParams, TQuery, TBody, THeader, TMeta, TResponse>, successResponseSchema?: z.ZodObject<TResponse>) {
					mainHandler = (data: RequestData<TParams, TQuery, TBody, THeader, TMeta>) => {
						// const a = z.object({ a: z.string() });
						// const b = zodParse(a, { a: "a" });
						// b;

						const parsedParams = params ? zodParse(params, data.params) : {} as TParams;
						const parsedQuery = query ? zodParse(query, data.query) : {} as TQuery;
						const parsedBody = body ? zodParse(body, data.body) : {} as TBody;
						const parsedHeaders = headers ? zodParse(headers, data.headers) : {} as THeader;
						const parsedMeta = meta ? zodParse(meta, data.meta) : {} as TMeta;
						const result = callback({
							params: parsedParams,
							query: parsedQuery,
							body: parsedBody,
							headers: parsedHeaders,
							meta: parsedMeta,
						});
						if (successResponseSchema) {
							const parsedResult = zodParse(successResponseSchema, result);
							return parsedResult;
						}
						return result;
					};
					_resSchema = successResponseSchema;
					return {
						build,
						after: (handler: (result: TResponse, res: Response) => void) => {
							afterHandler = handler;
							return { build };
						},
					};
				}
			};
		}

		function build(meta: {
			summary?: string;
			description?: string;
		} = {}) {
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

			__instance._realRouter[_method](_path,
				...beforeHandlers,
				mainCallback,
				...afterHandlers
			);

			// Documentation:
			const _absPath = [...__instance._realRouter.stack.map(r => r.path), _path].join('');

			ChuoiDocument.addEndpointDocumentation(
				_absPath,
				_method,
				_reqSchema,
				_resSchema,
				meta.summary,
				meta.description
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
			trace(path: string) {
				_method = "trace";
				_path = path;
				return _handler;
			}
		};

		return _switch;
	}
}
