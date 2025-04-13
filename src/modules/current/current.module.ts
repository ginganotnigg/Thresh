import { Server } from "socket.io";
import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { processController } from "./controllers/current.controller";
import { SocketController } from "./controllers/socket.controller";
import { ScheduleService } from "./controllers/schedule.controller";

export class CurrentModule extends ModuleBase {
	constructor(
		private readonly socket: Server
	) { super() }

	protected async _initialize(): Promise<void> {
		processController();
		ScheduleService.init();
		SocketController.init(this.socket);
	}
}