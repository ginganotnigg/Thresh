import { Namespace, Server } from 'socket.io';
import { ProcessQueryService } from './query.service';
import { logSocket } from '../../../configs/logger/winston';

export const SOCKET_EVENT = {
	REGISTERED: 'registered',
	ENDED: 'ended',
	SYNCED: 'sync',
	ANSWERED: 'answered',
};

export class NotifyService {
	private static _instance?: NotifyService;

	static init(server: Server): void {
		if (this._instance) {
			throw new Error('Socket controller already initialized');
		}
		const namespace = server.of('/current');
		this._instance = new NotifyService(namespace);
	}

	static notify(): NotifyService {
		if (!this._instance) {
			throw new Error('Socket controller not initialized');
		}
		return this._instance;
	}

	private constructor(
		private readonly namespace: Namespace,
	) {
		this.namespace.disconnectSockets();
		this.namespace.removeAllListeners();
		this.namespace.on('connection', (socket) => {
			logSocket(`[${socket.id}] => Client connected to: /current`);
			socket.on('disconnect', () => {
				logSocket(`[${socket.id}] => Client disconnected to: /current`);
			});
			socket.on(SOCKET_EVENT.REGISTERED, async (testId, userId) => {
				const id = await ProcessQueryService.getInProgressAttemptId(testId, userId);
				if (id == null) {
					return;
				}
				await socket.join(id.toString());
			});
		});
		this.namespace.adapter.on('join-room', (room, id) => {
			logSocket(`[${id}] => Client joined room: ${room}`);
		});
		this.namespace.adapter.on('leave-room', (room, id) => {
			logSocket(`[${id}] => Client left room: ${room}`);
		});
	}

	ended(attemptId: number): void {
		this.namespace.to(attemptId.toString()).emit(SOCKET_EVENT.ENDED);
		logSocket(`[ROOM] - [${attemptId}] => ${SOCKET_EVENT.ENDED}`);
	}

	synced(attemptId: number, timeLeft: number): void {
		this.namespace.to(attemptId.toString()).emit(SOCKET_EVENT.SYNCED, { timeLeft });
		logSocket(`[ROOM] - [${attemptId}] => ${SOCKET_EVENT.SYNCED} | timeLeft: ${timeLeft}`);
	}

	answered(attemptId: number, questionId: number, optionId?: number): void {
		this.namespace.to(attemptId.toString()).emit(SOCKET_EVENT.ANSWERED, { questionId, optionId });
		logSocket(`[ROOM] - [${attemptId}] => ${SOCKET_EVENT.ANSWERED} | questionId: ${questionId} | optionId: ${optionId ?? 'undefined'}`);
	}
}
