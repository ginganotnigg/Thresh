import express, { NextFunction, Request, Response, Router } from 'express';

type ExpressHandler = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

function tryCatch(controller: ExpressHandler) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			return await controller(req, res, next);
		} catch (error) {
			return next(error);
		}
	}
}

function tryCatchRouterWarpper(router: Router, method: "get" | "post" | "put" | "delete", path: string, controller: ExpressHandler) {
	return router[method](path, tryCatch(controller));
}

function childRouterFactory(router: Router, path: string | undefined) {
	const childRouter = express.Router();
	if (!path) {
		router.use(childRouter);
		return childRouter;
	}
	router.use(path, childRouter);
	return childRouter;
}

export {
	tryCatchRouterWarpper,
	childRouterFactory
}