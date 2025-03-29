export abstract class ModuleBase {
	async initialize(): Promise<void> {
		await this._initialize();
		console.log(`Module: ${this.constructor.name} initialized`);
	}

	protected abstract _initialize(): Promise<void>;
} 