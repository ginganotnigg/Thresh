import { CurrentQueryService } from "../services/query.service";
import { AttemptSchedule } from "./schemas/dto";
import schedule from "node-schedule";
import logger, { logTickError } from "../../../configs/logger/winston";
import { IntervalService } from "../../../services/interval.service";
import { eventDispatcherInstance } from "../../../library/cayduajs/event/event-queue";
import { AttemptStartedEvent, AttemptTimeSycnedEvent } from "../../../domain/current-attempt/current-attempt.events";
import { ProcessCommandService } from "../services/command.service";

export class ScheduleService {
	private static _instance?: ScheduleService;

	static instance() {
		if (!this._instance) {
			throw new Error('AttemptTimeMemory not initialized');
		}
		return this._instance
	}

	static async init() {
		if (this._instance) {
			throw new Error('AttemptTimeMemory already initialized');
		}
		const attempts = await CurrentQueryService.loadAttemptsForSchedule();
		this._instance = new ScheduleService(attempts.map(attempt => new AttemptSchedule(
			attempt.attemptId,
			attempt.endDate
		)));
		IntervalService.addJob(() => this.tick());
		eventDispatcherInstance.register(AttemptStartedEvent, (event) => {
			this.instance().addProgress(new AttemptSchedule(event.attemptId, event.endDate));
		});
	}

	private constructor(attemptTimes: AttemptSchedule[]) {
		this.currentAttempts = [];
		attemptTimes.forEach(attemptTime => {
			this.addProgress(attemptTime);
		});
	}

	private currentAttempts: AttemptSchedule[];

	addProgress(attemptTime: AttemptSchedule) {
		this.currentAttempts.push(attemptTime);
		ScheduleService.scheduleAttemptEvaluation(attemptTime.attemptId, attemptTime.endDate);
	}

	private static async scheduleAttemptEvaluation(attemptId: number, endDate: Date): Promise<void> {
		const jobName = `evaluate-test-${attemptId}`;
		schedule.scheduleJob(jobName, endDate, async () => {
			try {
				await ProcessCommandService.timesUp(attemptId);
				logger.info(`Scheduled job for: ${jobName} - ${endDate}`);
			} catch (error) {
				logger.info(`Failed schedule for: ${jobName}`, error);
			}
		});
	}

	private static async tick() {
		const promises = this.instance().currentAttempts.map(async (attempt) => {
			const now = new Date();
			const { endDate, attemptId } = attempt;
			const secondsLeft = Math.floor((endDate.getTime() - now.getTime()) / 1000);
			if (secondsLeft <= 0) {
				eventDispatcherInstance.dispatch(new AttemptTimeSycnedEvent(attemptId, 0));
				await ProcessCommandService.timesUp(attemptId);
			} else {
				eventDispatcherInstance.dispatch(new AttemptTimeSycnedEvent(attemptId, secondsLeft));
			}
		});
		try {
			(await Promise.all(promises))
		} catch (error) {
			logTickError(error);
			logger.error('Error in tick', error);
		}
	}
}