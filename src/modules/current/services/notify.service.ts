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

		this.namespace.use((socket, next) => {
			const userId = socket.handshake.auth.userId;
			if (userId == null) {
				return next(new Error("Authentication error"));
			}
			socket.data.userId = userId;
			return next();
		});

		this.namespace.on('connection', (socket) => {
			logSocket(`[${socket.id}] => Client connected to: /current`);
			socket.on('disconnect', () => {
				logSocket(`[${socket.id}] => Client disconnected to: /current`);
			});
			socket.on(SOCKET_EVENT.REGISTERED, async (testId) => {
				// Missing id here
				try {
					const candidateId = socket.data.userId;
					const id = await ProcessQueryService.getInProgressAttemptId(testId, candidateId);
					if (id == null) {
						return;
					}
					await socket.join(id.toString());
				} catch (error) {
					logSocket(`[${socket.id}] => Error`, { error });
				}
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

	synced(attemptId: number, secondsLeft: number): void {
		this.namespace.to(attemptId.toString()).emit(SOCKET_EVENT.SYNCED, { secondsLeft });
		logSocket(`[ROOM] - [${attemptId}] => ${SOCKET_EVENT.SYNCED} | secondsLeft: ${secondsLeft}`);
	}

	answered(attemptId: number, questionId: number, optionId?: number): void {
		this.namespace.to(attemptId.toString()).emit(SOCKET_EVENT.ANSWERED, { questionId, optionId });
		logSocket(`[ROOM] - [${attemptId}] => ${SOCKET_EVENT.ANSWERED} | questionId: ${questionId} | optionId: ${optionId ?? 'undefined'}`);
	}
}
