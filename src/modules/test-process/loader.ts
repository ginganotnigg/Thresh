import RetriverRepository from "./infra/repository/retriver.repo";
import { AttemptService } from "./domain/services/attempt.service";

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
}