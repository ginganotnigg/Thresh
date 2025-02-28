import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { tagsController } from "./tags.controller";

export class TagsModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		tagsController();
	}
}