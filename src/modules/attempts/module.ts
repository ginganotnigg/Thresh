import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { historyController } from "./controller/self-controller";
import { scheduleOngoingAttempts } from "./init/schedule-ongoing-attempts";

export class AttemptsModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		await scheduleOngoingAttempts();
		historyController();
	}
}