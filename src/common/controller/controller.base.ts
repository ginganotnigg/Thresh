import { Router, NextFunction, Request, Response } from "express";
import { MiddlewareBase } from "./middlewares/middleware.base";

class Route {
	constructor(
		public readonly method: "get" | "post" | "put" | "delete",
		public readonly path: string,
		public readonly controller: (req: Request, res: Response, next: NextFunction) => Promise<void> | void,
		public readonly middlewares?: MiddlewareBase[]
	) { }
}

export abstract class ControllerBase {
	private readonly routes: Route[] = [];

	constructor(
		private readonly basePath?: string,
		private readonly middlewares?: MiddlewareBase[]
	) { }

	protected route(
		method: "get" | "post" | "put" | "delete",
		path: string,
		controller: (req: Request, res: Response, next: NextFunction) => Promise<void | any> | void | any,
		middlewares?: MiddlewareBase[]
	) {
		this.routes.push(new Route(method, path, controller, middlewares));
	}

	public build() {
		const router = Router();
		if (this.middlewares) {
			this.middlewares.forEach(middleware => {
				router.use(middleware.handle);
			});
		}
		this.routes.forEach(route => {
			const { method, path, controller, middlewares } = route;
			const handlers = middlewares ? middlewares.map(mw => mw.handle) : [];
			router[method](path, ...handlers, async (req: Request, res: Response, next: NextFunction) => {
				try {
					await controller(req, res, next);
				} catch (error) {
					next(error);
				}
			});
		});
		if (this.basePath) {
			const baseRouter = Router();
			baseRouter.use(this.basePath, router);
			return baseRouter;
		}
		return router;
	}

	protected abstract initializeRoutes(): void;
}