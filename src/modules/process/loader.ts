import RetriverRepository from "./infra/repository/retriver.repo";
import { AttemptService } from "./domain/services/attempt.service";
import { eventDispatcherInstance } from "../../common/event/event-queue";

export class Loader {
	constructor(
		private readonly retriver: RetriverRepository,
		private readonly attemptService: AttemptService
	) { }

	/**
	 * Load all inprogress attempts once to set them 'live' when the module is loaded into the server.
	 */
	async loadInprogresses() {
		const attemptIds = await this.retriver.retriveAllInProgress();
		attemptIds.forEach(id => {
			this.attemptService.syncAttempt(id);
		});
	}

	/**
	 * Sync time of all inprogress attempts every 500ms.
	*/
	async syncTime() {
		const endDate = await this.retriver.getEndedDate();
		const timeLeft = Math.floor((endDate.getTime() - new Date().getTime()) / 1000);
		if (timeLeft <= 0) {
			clearInterval(interval);
			return;
		}
		eventDispatcherInstance.dispatch(new ProcessSyncedEvent(attemptId, timeLeft));

		setInterval(async () => {
			await this.loadInprogresses();
		}, 500);
	}

}