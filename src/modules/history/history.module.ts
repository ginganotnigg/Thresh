import { ModuleBase } from "../../common/module/module.base";
import { historyController } from "./history.controller";

export class HistoryModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		historyController();
	}
}