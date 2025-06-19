import sequelize from "../configs/orm/sequelize/sequelize";
import EventQueueModel from "../infrastructure/models/event_queue";
import { eventDispatcher } from "./EventDispatcherService";
import { initializeEventSystem } from "./init/intialize-event-system";
import { scheduleOngoingAttempts } from "./init/schedule-ongoing-attempts";

export class InitializeSystemService {
	static async initialize() {
		try {
			await initializeEventSystem();
			await scheduleOngoingAttempts();
			console.log('System initialized successfully');
		} catch (error) {
			console.error('Error initializing event system:', error);
			throw error;
		}
	}
}

