import { ModuleBase } from "../../library/cayduajs/module/module.base";
import { examController } from "./controller/exam.controller";
import { currentController } from "./controller/current.controller";
import { historyController } from "./controller/history.controller";
import { practiceController } from "./controller/practice.controller";
import { scheduleOngoingAttempts } from "./init/schedule-ongoing-attempts";

export class AttemptsModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		await scheduleOngoingAttempts();
		currentController();
		examController();
		historyController();
		practiceController();
	}
}