import { ModuleBase } from "../../library/cayduajs/module/module.base";
import controlerExam from "./controller";

export class ExamModule extends ModuleBase {
	protected async _initialize(): Promise<void> {
		controlerExam();
	}
}