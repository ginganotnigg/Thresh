import schedule from 'node-schedule';
import { EventController } from "../controllers/event.controller";

export class ScheduleService {
	static async scheduleAttemptEvaluation(attemptId: number, endDate: Date): Promise<void> {
		const jobName = `evaluate-test-${attemptId}`;
		schedule.scheduleJob(jobName, endDate, async () => {
			try {
				await EventController.timeUp(attemptId);
				console.log(`Scheduled job for: ${jobName} - ${endDate}`);
			} catch (error) {
				console.error(`Failed schedule for: ${jobName}`, error);
			}
		});
	}
}