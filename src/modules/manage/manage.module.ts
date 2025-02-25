import { ManageController } from "./manage.controller";
import { CommandService } from "./services/command.service";
import { QueryService } from "./services/query.service";
import { ModuleBase } from "../../common/module/module.base";

export class ManageModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		const command = new CommandService();
		const query = new QueryService();
		const controller = new ManageController(this.router, query, command);
		controller.initialize();
	}
}