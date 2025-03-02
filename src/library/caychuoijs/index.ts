import { Application, Router } from "express";
import { Constructor } from "./utils/type";
import { IChuoiExceptionHandler, IChuoiHandler } from "./contracts";
import { z } from "zod";
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ChuoiRouter } from "./router";
import { ChuoiDocument } from "./documentation/open-api";
import { writeFileSync } from "fs";
import swaggerUi from 'swagger-ui-express';
import { ChuoiContainer } from "./utils/container";

export class Chuoi {
	private static _globalRouter?: ChuoiRouter;
	private static _baseRouter?: Router;
	private static _config: {
		basePath: string,
		title: string,
		version: string
	};

	private constructor() { }

	private static get(): { globalRouter: ChuoiRouter, baseRouter: Router } {
		if (!this._globalRouter || !this._baseRouter) {
			throw new Error("ChuoiController not initialized");
		}
		return { globalRouter: this._globalRouter, baseRouter: this._baseRouter };
	}

	static init(router: Router, {
		basePath,
		title,
		version,
	}: {
		basePath: string,
		title: string,
		version: string,
	}): void {
		extendZodWithOpenApi(z);
		this._baseRouter = router;
		this._globalRouter = new ChuoiRouter(router, basePath);
		this._config = {
			basePath,
			title,
			version
		}
	}

	static middleware(...handlers: Constructor<IChuoiHandler>[]) {
		if (!this._baseRouter) {
			throw new Error("ChuoiController not initialized");
		}
		this._baseRouter.use(...handlers.map(h => ChuoiContainer.retrieve(h).handle));
	}

	static newRoute(path?: string): ChuoiRouter {
		if (!this._globalRouter) {
			throw new Error("ChuoiController not initialized");
		}
		const child = this._globalRouter.down(path);
		return child;
	}

	static final(errorHandler: IChuoiExceptionHandler) {
		if (!this._baseRouter) {
			throw new Error("ChuoiController not initialized");
		}
		this._baseRouter.use(errorHandler.handle);
	}

	static log(logger: (message: string, isWarning: boolean) => void, router: Application | Router | undefined = this._baseRouter, parentPath = ''): void {
		if (!router || !('_router' in router || 'stack' in router)) {
			logger('Invalid router object', true);
			return;
		}

		let stack: any[] = [];
		// If the router is a Application object, get the stack from it
		if ('_router' in router) {
			stack = (router as any)._router.stack || [];
		}
		else {
			stack = (router as any).stack || [];
		}

		stack.forEach((layer: any) => {
			if (layer.route) {
				// If the layer is a direct route, extract methods and path
				const routePath = parentPath + layer.route.path;
				const methods = Object.keys(layer.route.methods).map(method => method.toUpperCase());
				logger(`[${methods.join(', ')}] ${routePath}`, false);
			} else if (layer.name === 'router' && layer.handle.stack) {
				const subPath = parentPath + (layer.regexp.source
					.replace(/^\/\^\\/, '') // Remove leading regex cruft
					.replace(/\\\/\?\(\?=\\\/\|\$\)\/i/, '') // Remove trailing regex cruft
					|| '');
				this.log(logger, layer.handle, subPath);
			}
		});
	}

	static doc(docPath: string = '/api-docs'): void {
		if (!this._baseRouter) {
			throw new Error("ChuoiController not initialized");
		}
		const url = `http://localhost:${process.env.PORT}`
		const swaggerSpec = ChuoiDocument.generateV31({
			info: {
				title: this._config.title,
				version: this._config.version,
			},
			servers: [
				{
					url: url + this._config.basePath,
					description: "Localhost"
				},
			]
		});
		writeFileSync("swagger.json", JSON.stringify(swaggerSpec));
		this._baseRouter.use(docPath, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
		console.log(`API documentation is available at ${url}${docPath}`);
	}
}
