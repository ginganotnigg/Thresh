import { ModuleBase } from "../../common/module/module.base";
import { TagsController } from "./tags.controller";

export class TagsModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		const controller = new TagsController(this.router);
		controller.initialize();
	}
}