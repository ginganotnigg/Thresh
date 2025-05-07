import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { attemptController } from "./controller/controller";
import { scheduleOngoingAttempts } from "./init/schedule-ongoing-attempts";

export class AttemptsModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		await scheduleOngoingAttempts();
		attemptController();
	}
}