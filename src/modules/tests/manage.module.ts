import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { manageController } from "./manage.controller";

export class ManageModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		manageController();
	}
}