class ChuoiJsInjector {
	private middlewareSingleton: Map<string, any> = new Map();

	addSingleton<T extends object>(middleware: new (...args: any[]) => T, ...args: any[]): void {
		const middlewareName = middleware.name;
		if (!this.middlewareSingleton.has(middlewareName)) {
			this.middlewareSingleton.set(middlewareName, new middleware(...args));
		}
	}

	getSingleton<T>(middleware: new (...args: any[]) => T): T {
		const middlewareName = middleware.name;
		if (this.middlewareSingleton.has(middlewareName)) {
			return this.middlewareSingleton.get(middlewareName) as T;
		}
		throw new Error(`Middleware ${middlewareName} not found`);
	}
}

const chuoiInject = new ChuoiJsInjector();
export { chuoiInject };