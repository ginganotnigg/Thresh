import { eventDispatcherInstance } from "../../../../common/event/event-queue";
import { IRetriverRepository } from "../contracts/retriver.repo.i";
import { IWriteRepository } from "../contracts/write.repo.i";
import schedule from 'node-schedule';
import { ProcessEndedEvent } from "../events/process-ended.event";

export class AttemptService {
	constructor(
		private readonly retriver: IRetriverRepository,
		private readonly write: IWriteRepository,
	) { }

	async evaluateTestAttempt(attemptId: number): Promise<void> {
		await this.write.submitAttempt(attemptId);
		eventDispatcherInstance.dispatch(new ProcessEndedEvent(attemptId));
	}

	async syncAttempt(attemptId: number, endDate: Date | undefined = undefined): Promise<void> {
		endDate ??= await this.retriver.getEndedDate(attemptId);
		const now = new Date();
		if (now >= endDate) {
			await this.evaluateTestAttempt(attemptId);
			return;
		}
		const jobName = `evaluate-test-${attemptId}`;
		schedule.scheduleJob(jobName, endDate, async () => {
			try {
				await this.evaluateTestAttempt(attemptId);
				console.log(`Scheduled job for: ${jobName} - ${endDate}`);
			} catch (error) {
				console.error(`Failed schedule for: ${jobName}`, error);
			}
		});
	}
}