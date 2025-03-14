import { Server } from "socket.io";
import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { processController } from "./controllers/current.controller";
import { NotifyService } from "./services/notify.service";
import { TimerService } from "./services/timer";
import { AttemptTimeMemory } from "./services/attempt-time.memory";

export class ProcessModule extends ModuleBase {
	constructor(
		private readonly socket: Server
	) { super() }

	protected async _initialize(): Promise<void> {
		processController();
		AttemptTimeMemory.init();
		TimerService.init();
		NotifyService.init(this.socket);
	}
}