import { Router, NextFunction, Request, Response } from "express";
import { MiddlewareBase } from "./middleware.base";

export type HTTP_METHOD = "get" | "post" | "put" | "delete" | "patch" | "options" | "head" | "connect" | "trace";

class Route {
	constructor(
		public readonly method: HTTP_METHOD,
		public readonly path: string,
		public readonly controller: (req: Request, res: Response, next: NextFunction) => Promise<void> | void,
		public readonly middlewares?: MiddlewareBase[]
	) { }
}

export abstract class ControllerBase {
	private readonly routes: Route[] = [];

	constructor(
		private readonly router: Router,
		private readonly basePath?: string,
		private readonly middlewares?: MiddlewareBase[],
	) { }

	protected route(
		method: HTTP_METHOD,
		path: string,
		controller: (req: Request, res: Response, next: NextFunction) => Promise<void | any> | void | any,
		middlewares?: MiddlewareBase[]
	) {
		this.routes.push(new Route(method, path, controller, middlewares));
	}

	public initialize() {
		this.initializeRoutes();
		const createdRouter = Router();
		if (this.middlewares) {
			this.middlewares.forEach(middleware => {
				createdRouter.use((req, res, next) => middleware.handle(req, res, next));
			});
		}
		this.routes.forEach(route => {
			const { method, path, controller, middlewares } = route;
			const handlers = middlewares ? middlewares.map(mw => mw.handle) : [];
			createdRouter[method](path, ...handlers, async (req: Request, res: Response, next: NextFunction) => {
				try {
					await controller(req, res, next);
				} catch (error) {
					next(error);
				}
			});
		});
		if (this.basePath) {
			this.router.use(this.basePath, createdRouter);
		} else {
			this.router.use(createdRouter);
		}
	}

	protected abstract initializeRoutes(): void;
}