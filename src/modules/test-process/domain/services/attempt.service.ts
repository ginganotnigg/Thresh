import { eventDispatcherInstance } from "../../../../common/event/event-queue";
import { IRetriverRepository } from "../contracts/retriver.repo.i";
import { IWriteRepository } from "../contracts/write.repo.i";
import schedule from 'node-schedule';
import { ProcessEvaluatedEvent } from "../events/process-evaluated.event";
import { ProcessSyncedEvent } from "../events/process-synced-event";

const SYNC_TIME = 5000; // 5 seconds

export class AttemptService {
	constructor(
		private readonly retriver: IRetriverRepository,
		private readonly write: IWriteRepository,
	) { }

	async evaluateTestAttempt(attemptId: number): Promise<void> {
		const totalScore = await this.retriver.getCalculatedTotalScore(attemptId);
		await this.write.submitAttemptScore(attemptId, totalScore);
		eventDispatcherInstance.dispatch(new ProcessEvaluatedEvent(attemptId));
	}

	async syncAttempt(attemptId: number, endDate: Date | undefined = undefined): Promise<void> {
		endDate ??= await this.retriver.getEndedDate(attemptId);
		const now = new Date();
		if (now >= endDate) {
			await this.evaluateTestAttempt(attemptId);
			return;
		}
		const interval = setInterval(async () => {
			const timeLeft = Math.floor((endDate.getTime() - new Date().getTime()) / 1000);
			if (timeLeft <= 0) {
				clearInterval(interval);
				return;
			}
			eventDispatcherInstance.dispatch(new ProcessSyncedEvent(attemptId, timeLeft));
		}, SYNC_TIME);

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