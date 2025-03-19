import { CurrentQueryService } from "../services/query.service";
import { AttemptSchedule } from "./schemas/dto";
import schedule from "node-schedule";
import logger, { logTickError } from "../../../configs/logger/winston";
import { IntervalService } from "../../../services/interval.service";
import { eventDispatcherInstance } from "../../../library/cayduajs/event/event-queue";
import { AttemptEndedEvent, AttemptStartedEvent, AttemptTimeSycnedEvent } from "../../../domain/current-attempt/current-attempt.events";
import { ProcessCommandService } from "../services/command.service";

export class ScheduleService {
	private static _instance?: ScheduleManager;

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
		this._instance = new ScheduleManager(attempts.map(attempt => new AttemptSchedule(
			attempt.attemptId,
			attempt.endDate
		)));
		IntervalService.addJob(() => this.tick());
		eventDispatcherInstance.register(AttemptStartedEvent, (event) => {
			this.instance().addProgress(new AttemptSchedule(event.attemptId, event.endDate));
		});
		eventDispatcherInstance.register(AttemptEndedEvent, (event) => {
			this.instance().removeProgress(event.attemptId);
		});
	}

	private static async tick() {
		const promises = this.instance().getAttemptSchedules().map(async (attempt) => {
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

class ScheduleManager {
	private _attemptSchedules: AttemptSchedule[];

	constructor(attemptSchedules: AttemptSchedule[]) {
		this._attemptSchedules = [];
		attemptSchedules.forEach(attemptTime => {
			this.addProgress(attemptTime);
		});
	}

	addProgress(attemptTime: AttemptSchedule) {
		this._attemptSchedules.push(attemptTime);
		this.scheduleAttemptEvaluation(attemptTime.attemptId, attemptTime.endDate);
	}

	removeProgress(attemptId: number) {
		this._attemptSchedules = this._attemptSchedules.filter(attempt => attempt.attemptId !== attemptId);
		logger.info(`Remove attempt schedule: ${attemptId}`);
		schedule.cancelJob(attemptId.toString());
	}

	getAttemptSchedules() {
		return this._attemptSchedules;
	}

	async scheduleAttemptEvaluation(attemptId: number, endDate: Date): Promise<void> {
		schedule.scheduleJob(attemptId.toString(), endDate, async () => {
			try {
				await ProcessCommandService.timesUp(attemptId);
				logger.info(`Scheduled attempt for: ${attemptId} - ${endDate}`);
			} catch (error) {
				logger.info(`Failed schedule attempt: ${attemptId}`, error);
			}
		});
	}
}