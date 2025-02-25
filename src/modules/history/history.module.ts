import { QueryService } from "./services/query.service";
import { HistoryController } from "./history.controller";
import { ModuleBase } from "../../common/module/module.base";

export class HistoryModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		const query = new QueryService();
		const controller = new HistoryController(this.router, query);
		controller.initialize();
	}
}