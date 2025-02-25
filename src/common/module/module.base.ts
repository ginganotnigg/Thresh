import { Router } from "express";

export abstract class ModuleBase {
	protected readonly router: Router;

	constructor(
		router: Router,
		version?: string
	) {
		this.router = Router();
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