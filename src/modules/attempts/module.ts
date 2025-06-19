import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { scheduleOngoingAttempts } from "../../controllers/attempts/init/schedule-ongoing-attempts";
import { AttemptsController } from "../../controllers/attempts/attempts.controller";

export class AttemptsModule extends ModuleBase {
	protected async _initialize(): Promise<void> {

	}
}