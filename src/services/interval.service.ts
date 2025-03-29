import { logTickError } from "../configs/logger/winston";

// Todo: make global and handlers configurable

const TICK = 1000; // Refresh every 1 second

export class IntervalService {
	private static jobId: number = 0;
	private static jobs: Map<number, () => void> = new Map();

	static init() {
		setInterval(() => {
			try {
				this.jobs.forEach((handler) => {
					handler();
				});
			} catch (error) {
				logTickError(error);
			}
		}, TICK);
	}

	static addJob(handler: () => void): number {
		this.jobId++;
		this.jobs.set(this.jobId, handler);
		return this.jobId;
	}

	static removeJob(jobId: number): void {
		this.jobs.delete(jobId);
	}
}