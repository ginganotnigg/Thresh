import RetriverRepository from "./infra/repository/retriver.repo";
import { AttemptService } from "./domain/domain.service";
import { eventDispatcherInstance } from "../../common/event/event-queue";

export class Loader {
	constructor(
		private readonly retriver: RetriverRepository,
		private readonly attemptService: AttemptService
	) { }

	async initialize() {
		await this.loadInprogresses();
		await this.syncTime();
	}

	/**
	 * Load all inprogress attempts once to set them 'live' when the module is loaded into the server.
	 */
	private async loadInprogresses() {
		const attemptIds = await this.retriver.retriveAllInProgress();
		attemptIds.forEach(id => {
			this.attemptService.scheduleAttemptEvaluation(id);
		});
	}

	/**
	 * Sync time of all inprogress attempts every 500ms.
	*/
	private async syncTime() {
		setInterval(async () => {
			const attemptIds = await this.retriver.retriveAllInProgress();
			attemptIds.forEach(id => {
				this.attemptService.syncAttemptTimeLeft(id);
			});
		}, 500);
	}
}