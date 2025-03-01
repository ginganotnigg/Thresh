import { Router } from "express";
import { Constructor } from "./utils/type";
import { IChuoiExceptionHandler, IChuoiHandler } from "./contracts";
import { z } from "zod";
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ChuoiRouter } from "./router";

export class Chuoi {
	private static _globalRouter?: ChuoiRouter;
	private static _childRouters: ChuoiRouter[] = [];

	static init(router: Router, config: {
		basePath: string,
	}): void {
		extendZodWithOpenApi(z);
		const _router = Router();
		router.use(config.basePath, _router);
		this._globalRouter = new ChuoiRouter(_router, undefined, config.basePath);
	}

	static middleware(...handlers: Constructor<IChuoiHandler>[]) {
		if (!this._globalRouter) {
			throw new Error("ChuoiController not initialized");
		}
		this._globalRouter.handler(...handlers);
	}

	static newRoute(path?: string): ChuoiRouter {
		if (!this._globalRouter) {
			throw new Error("ChuoiController not initialized");
		}
		const child = this._globalRouter.down(path);
		this._childRouters.push(child);
		return child;
	}

	static final(errorHandler: IChuoiExceptionHandler) {
		if (!this._globalRouter) {
			throw new Error("ChuoiController not initialized");
		}
		this._globalRouter.errorHandler(errorHandler);
	}
}

