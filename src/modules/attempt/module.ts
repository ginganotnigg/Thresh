import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { historyController } from "./controller";

export class HistoryModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		historyController();
	}
}