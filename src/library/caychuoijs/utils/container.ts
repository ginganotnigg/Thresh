export class ChuoiContainer {
	private static middlewareSingleton: Map<string, any> = new Map();

	static register<T extends object>(middleware: new () => T): void {
		const middlewareName = middleware.name;
		if (!this.middlewareSingleton.has(middlewareName)) {
			this.middlewareSingleton.set(middlewareName, new middleware());
		}
	}

	static retrieve<T>(middleware: new () => T): T {
		const middlewareName = middleware.name;
		if (this.middlewareSingleton.has(middlewareName)) {
			return this.middlewareSingleton.get(middlewareName) as T;
		}
		throw new Error(`Middleware ${middlewareName} not found`);
	}
}
