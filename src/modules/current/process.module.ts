import { Server } from "socket.io";
import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { processController } from "./controllers/current.controller";
import { SocketController } from "./controllers/socket.controller";
import { IntervalService } from "../../services/interval.service";
import { ScheduleService } from "./controllers/schedule.controller";

export class ProcessModule extends ModuleBase {
	constructor(
		private readonly socket: Server
	) { super() }

	protected async _initialize(): Promise<void> {
		processController();
		ScheduleService.init();
		IntervalService.init();
		SocketController.init(this.socket);
	}
}