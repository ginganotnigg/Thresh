import { MiddlewareBase } from "./middleware.base";

class MiddlewareInjector {
	private middlewareSingleton: Map<string, MiddlewareBase> = new Map();
	private middlewareTransient: Map<string, new (...args: any[]) => any> = new Map();

	addSingleton<T extends MiddlewareBase>(middleware: new (...args: any[]) => T, ...args: any[]): void {
		const middlewareName = middleware.name;
		if (!this.middlewareSingleton.has(middlewareName)) {
			this.middlewareSingleton.set(middlewareName, new middleware(...args));
		}
	}

	addTransient<T>(middleware: new (...args: any[]) => T): void {
		const middlewareName = middleware.name;
		if (!this.middlewareTransient.has(middlewareName)) {
			this.middlewareTransient.set(middlewareName, middleware);
		}
	}

	getSingleton<T>(middleware: new (...args: any[]) => T): T {
		const middlewareName = middleware.name;
		if (this.middlewareSingleton.has(middlewareName)) {
			return this.middlewareSingleton.get(middlewareName) as T;
		}
		throw new Error(`Middleware ${middlewareName} not found`);
	}

	getTransient<T>(middleware: new (...args: any[]) => T, ...args: any[]): T {
		const middlewareName = middleware.name;
		if (this.middlewareTransient.has(middlewareName)) {
			return new (this.middlewareTransient.get(middlewareName)!)(...args) as T;
		}
		throw new Error(`Middleware ${middlewareName} not found`);
	}
}

const middlewareInjectorInstance = new MiddlewareInjector();
export { middlewareInjectorInstance };