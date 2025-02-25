import { Namespace } from 'socket.io';
import QueryUsecase from '../usecase/query.service';
import { INotify } from '../domain/contracts/notify.i';

// Todo: extract candidateId from request
const candidateId = "C#0T001";

export const SOCKET_EVENT = {
	REGISTERED: 'registered',
	ENDED: 'ended',
	SYNCED: 'sync',
	ANSWERED: 'answered',
};

export class SocketController implements INotify {
	constructor(
		private readonly namespace: Namespace,
		private readonly query: QueryUsecase
	) { }

	sendEvaluated(attemptId: number): void {
		this.namespace.to(attemptId.toString()).emit(SOCKET_EVENT.ENDED);
	}

	sendSynced(attemptId: number, timeLeft: number): void {
		this.namespace.to(attemptId.toString()).emit(SOCKET_EVENT.SYNCED, timeLeft);
	}

	// Not necessary, Can be removed if too complex
	sendAnswered(attemptId: number, questionId: number, optionId?: number): void {
		this.namespace.to(attemptId.toString()).emit(SOCKET_EVENT.ANSWERED, { questionId, optionId });
	}

	public initialize() {
		this.namespace.disconnectSockets();
		this.namespace.removeAllListeners();
		this.namespace.on('connection', (socket) => {
			console.log(`Client connected: ${socket.id}`);

			socket.on('disconnect', () => {
				console.log(`Client disconnected: ${socket.id}`);
			});

			socket.on(SOCKET_EVENT.REGISTERED, async (testId) => {
				const id = await this.query.getInProgressAttemptId(testId, candidateId);
				if (id == null) {
					return;
				}
				await socket.join(id.toString());
			});
		});
		console.log('Socket controller initialized');
	}
}