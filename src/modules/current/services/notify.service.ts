import { Namespace, Server } from 'socket.io';
import { ProcessQueryService } from './query.service';

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
			console.log(`Client connected: ${socket.id}`);
			socket.on('disconnect', () => {
				console.log(`Client disconnected: ${socket.id}`);
			});
			socket.on(SOCKET_EVENT.REGISTERED, async (testId, userId) => {
				const id = await ProcessQueryService.getInProgressAttemptId(testId, userId);
				if (id == null) {
					return;
				}
				await socket.join(id.toString());
			});
		});
		console.log('Socket controller initialized');
	}

	ended(attemptId: number): void {
		this.namespace.to(attemptId.toString()).emit(SOCKET_EVENT.ENDED);
	}

	synced(attemptId: number, timeLeft: number): void {
		this.namespace.to(attemptId.toString()).emit(SOCKET_EVENT.SYNCED, { timeLeft });
	}

	// Not necessary, Can be removed if too complex
	answered(attemptId: number, questionId: number, optionId?: number): void {
		this.namespace.to(attemptId.toString()).emit(SOCKET_EVENT.ANSWERED, { questionId, optionId });
	}
}
