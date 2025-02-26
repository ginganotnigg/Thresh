import { Router } from "express";

export abstract class ModuleBase {
	constructor(
		protected readonly router: Router,
		version?: string
	) {

		if (version != null) {
			router.use(version, this.router);
		}
	}

	async initialize(): Promise<void> {
		await this._initialize();
		console.log(`Module: ${this.constructor.name} initialized`);
	}

	protected abstract _initialize(): Promise<void>;
} 