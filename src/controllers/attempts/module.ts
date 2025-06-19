import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { AttemptsController } from "./attempts.controller";
import { scheduleOngoingAttempts } from "./init/schedule-ongoing-attempts";

export class AttemptsModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		const controller = new AttemptsController();
		controller.constructRouter();
		await scheduleOngoingAttempts();
	}
}