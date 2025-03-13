import { Server } from "socket.io";
import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { processController } from "./controllers/current.controller";
import { NotifyService } from "./services/notify.service";

export class ProcessModule extends ModuleBase {
	constructor(
		private readonly socket: Server
	) { super() }

	protected async _initialize(): Promise<void> {
		processController();
		NotifyService.init(this.socket);
	}
}