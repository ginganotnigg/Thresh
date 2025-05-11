import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { controller } from "./controller";

export class TestModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		controller();
	}
}