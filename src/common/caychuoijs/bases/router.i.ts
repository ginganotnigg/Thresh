import { Request, Router } from "express";
import { IChuoiHandler } from "./handler.i";
import { Constructor, CallbackExpressHandler, RequestData } from "../type";
import { validateHelperObject } from "../../controller/helpers/validation.helper";
import { IsString } from "class-validator";

export class ChuoiRouter {
	private readonly router: Router;
	private readonly handlers: IChuoiHandler[] = [];
	private readonly children: ChuoiRouter[] = [];

	constructor(router: Router, routerPath: string) {
		this.router = Router();
		router.use(routerPath, this.router);
	}

	giveBirth(childPath: string) {
		const child = new ChuoiRouter(this.router, childPath);
		this.children.push(child);
		return child;
	}

	handler(handler: IChuoiHandler) {
		this.handlers.push(handler);
		return this;
	}

	path(path: string) {
		const __instance = this;
		let method: "get" | "post" | "put" | "delete" | "patch" | "options" | "head" | "connect" | "trace" = "get";
		let beforeHandlers: CallbackExpressHandler[] = [];
		let afterHandlers: CallbackExpressHandler[] = [];
		let mainHandler: (data: RequestData<any, any, any, any>) => void;

		function schema<
			TParams extends Record<string, any>,
			TQuery extends Record<string, any>,
			TBody extends Record<string, any>,
			THeader extends Record<string, any>
		>(
			{
				params,
				query,
				body,
				headers,
			}: {
				params?: Constructor<TParams>,
				query?: Constructor<TQuery>,
				body?: Constructor<TBody>,
				headers?: Constructor<THeader>,
			} = {}
		) {

			return {
				handle(m: (data: RequestData<TParams, TQuery, TBody, THeader>) => void) {
					async function dataParser(data: RequestData<TParams, TQuery, TBody, THeader>): Promise<RequestData<any, any, any, any>> {
						const parsedParams = params ? await validateHelperObject(data.params, params) : {};
						const parsedQuery = query ? await validateHelperObject(data.query, query) : {};
						const parsedBody = body ? await validateHelperObject(data.body, body) : {};
						const parsedHeaders = headers ? await validateHelperObject(data.headers, headers) : {};
						return {
							params: parsedParams,
							query: parsedQuery,
							body: parsedBody,
							headers: parsedHeaders
						};
					}
					mainHandler = async (data) => {
						const parsedData = await dataParser(data);
						m(parsedData);
					};
					return _build;
				}
			}
		}

		function end() {
			const mainCallback: CallbackExpressHandler = (req, res, next) => {
				const data = {
					params: req.params,
					query: req.query,
					body: req.body,
					headers: req.headers
				};
				mainHandler(data);
			}
			__instance.router[method](path,
				...beforeHandlers,
				mainCallback,
				...afterHandlers
			);
			return __instance;
		}

		const _handler = {
			before: (...handlers: IChuoiHandler[]) => {
				beforeHandlers = handlers.map(h => h.handle);
				return { schema };
			},
			schema,
		};

		const _build = {
			after: (...handlers: IChuoiHandler[]) => {
				afterHandlers = handlers.map(h => h.handle);
				return { end };
			},
			end
		}

		const _switch = {
			get() {
				method = "get";
				return _handler;
			},
			post() {
				method = "post";
				return _handler;
			},
			put() {
				method = "put";
				return _handler;
			},
			delete() {
				method = "delete";
				return _handler;
			},
			patch() {
				method = "patch";
				return _handler;
			},
			options() {
				method = "options";
				return _handler;
			},
			head() {
				method = "head";
				return _handler;
			},
			connect() {
				method = "connect";
				return _handler;
			},
			trace() {
				method = "trace";
				return _handler;
			}
		}

		return _switch;
	}
}

const router = new ChuoiRouter(Router(), "/api");

// class ParamsClass {
// 	@IsString()
// 	id: string;
// }

// class BodyClass {
// 	username: string;
// 	password: string;
// }

// router
// 	.giveBirth("/auth")
// 	.path("/login")
// 	.post()
// 	.schema({
// 		params: ParamsClass,
// 		body: BodyClass
// 	})
// 	.handle(({ params, body }) => { console.log(body.password) }).after().end();


export { router };