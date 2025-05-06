import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { controllerPractice } from "./controller";

export class PracticeModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		controllerPractice();
	}
}