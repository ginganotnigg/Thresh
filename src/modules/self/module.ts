import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { selfController } from "./controller";

export class SelfModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		selfController();
	}
}