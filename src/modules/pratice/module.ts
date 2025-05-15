import { ModuleBase } from "../../library/cayduajs/module/module.base";
import controllerFeedback from "./controllers/feedback.controller";
import controllerPractice from "./controllers/practice.controller";
import controllerTemplate from "./controllers/template.controller";

export class PracticeModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		controllerTemplate();
		controllerPractice();
		controllerFeedback();
	}
}