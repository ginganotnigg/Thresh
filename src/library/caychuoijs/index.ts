import { Application, Router } from "express";
import { Constructor } from "./utils/type";
import { IChuoiExceptionHandler, IChuoiMiddleware } from "./main/contracts";
import { z } from "zod";
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ChuoiRouter } from "./main/router";
import { ChuoiDocument } from "./documentation/open-api";
import { writeFileSync } from "fs";
import swaggerUi from 'swagger-ui-express';
import { ChuoiContainer } from "./utils/container";
import { env } from "../../utils/env";
import { ChuoiSecurityBase } from "./documentation/security";

export class Chuoi {
	private static _globalRouter?: ChuoiRouter;
	private static _baseRouter?: Router;
	private static _config: {
		basePath: string,
		title: string,
		version: string
	};

	private constructor() { }

	static init(app: Application, {
		basePath,
		title,
		version,
	}: {
		basePath: string,
		title: string,
		version: string,
	}): void {
		extendZodWithOpenApi(z);
		const router = Router();
		app.use(basePath, router);
		this._baseRouter = router;
		this._globalRouter = new ChuoiRouter(router);
		this._config = {
			basePath,
			title,
			version
		}
	}

	static middleware(...handlers: Constructor<IChuoiMiddleware>[]) {
		if (!this._baseRouter) {
			throw new Error("ChuoiController not initialized");
		}
		this._baseRouter.use(...handlers.map(h => {
			const instance = ChuoiContainer.retrieve(h);
			instance.handle = instance.handle.bind(instance);
			return instance.handle;
		}));
	}

	static newRoute(path?: string): ChuoiRouter {
		if (!this._globalRouter) {
			throw new Error("ChuoiController not initialized");
		}
		const child = this._globalRouter.down(path);
		return child;
	}

	static final(errorHandler: Constructor<IChuoiExceptionHandler>): void {
		if (!this._baseRouter) {
			throw new Error("ChuoiController not initialized");
		}
		this._baseRouter.use(ChuoiContainer.retrieve(errorHandler).handle);
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
				const extractedPath = extractPathFromRegex(layer.regexp);
				const subPath = parentPath + extractedPath;
				this.log(logger, layer.handle, subPath);
			}
		});
	}

	static doc<TScheme extends string>(security?: ChuoiSecurityBase<TScheme>, docPath: string = '/api-docs'): void {
		if (!this._baseRouter) {
			throw new Error("ChuoiController not initialized");
		}

		const url = `http://localhost:${env.port}`;
		const swaggerSpec = ChuoiDocument.generateV31(security, {
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
		writeFileSync("openapi.json", JSON.stringify(swaggerSpec));
		this._baseRouter.use(docPath, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
		console.log(`API documentation is available at ${url}${this._config.basePath + docPath}`);
	}
}

const extractPathFromRegex = (regexp: RegExp) => {
	let path = regexp.toString()  // Convert to string
		.replace('/^', '')         // Remove start anchor (^)
		.replace('\\/?(?=\\/|$)/i', '') // Remove trailing regex part
		.replace(/\\\//g, '/');    // Convert escaped slashes back to normal ones
	return path;
};
