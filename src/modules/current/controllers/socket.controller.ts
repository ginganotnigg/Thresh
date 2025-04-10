import { Namespace, Server, Socket } from 'socket.io';
import { CurrentQueryService } from '../services/query.service';
import { logSocket } from '../../../configs/logger/winston';
import { CurrentTestNamespace, CurrentTestSocket } from './schemas/socket';
import { eventDispatcherInstance } from '../../../library/cayduajs/event/event-queue';
import { AttemptEndedEvent, AttemptTimeSycnedEvent } from '../../../domain/current-attempt/current-attempt.events';
import { ProcessCommandService } from '../services/command.service';

export class SocketController {
	private static _instance?: SocketController;

	static init(server: Server): void {
		if (this._instance) {
			throw new Error('Socket controller already initialized');
		}
		const namespace = server.of('/current');
		this._instance = new SocketController(namespace);
	}

	static notify(): SocketController {
		if (!this._instance) {
			throw new Error('Socket controller not initialized');
		}
		return this._instance;
	}

	private constructor(
		private readonly namespace: CurrentTestNamespace
	) {
		this.configNamespace();
		this.emit();
	}

	private configNamespace() {
		this.namespace.disconnectSockets();
		this.namespace.removeAllListeners();

		this.namespace.use((socket, next) => {
			const userId = socket.handshake.auth.userId;
			if (userId == null) {
				return next(new Error("Authentication error"));
			}
			socket.data.candidateId = userId;
			return next();
		});

		this.namespace.on('connection', (socket) => {
			logSocket(`[${socket.id}] => Client connected to: /current`);
			socket.on('disconnect', () => {
				logSocket(`[${socket.id}] => Client disconnected to: /current`);
			});
			this.listen(socket);
		});
		this.namespace.adapter.on('join-room', (room, id) => {
			logSocket(`[${id}] => Client joined room: ${room}`);
		});
		this.namespace.adapter.on('leave-room', (room, id) => {
			logSocket(`[${id}] => Client left room: ${room}`);
		});
	}

	private emit(): void {
		eventDispatcherInstance.register(AttemptEndedEvent, ev => {
			this.namespace.to(ev.attemptId.toString()).emit("ENDED");
			logSocket(`[ROOM] - [${ev.attemptId}] => ENDED`);
		});

		eventDispatcherInstance.register(AttemptTimeSycnedEvent, ev => {
			const { attemptId, secondsLeft } = ev;
			this.namespace.to(attemptId.toString()).emit("CLOCK_SYNCED", { secondsLeft });
			logSocket(`[ROOM] - [${attemptId}] => SYNCED | secondsLeft: ${secondsLeft}`);
		});
	}

	private listen(socket: CurrentTestSocket): void {
		socket.on("REGISTERED", async ({ attemptId }, cb) => {
			try {
				const isInprogress = await CurrentQueryService.isAttemptInProgress(attemptId);
				cb({ isInprogress });
				if (isInprogress == false) return;
				await socket.join(attemptId.toString());
				logSocket(`[${socket.id}] => Client registered to room: ${attemptId}`);
			} catch (error) {
				logSocket(`[${socket.id}] => Error`, { error });
			}
		});
		socket.on("ANSWERED", async ({ attemptId, questionId, optionId }, cb) => {
			try {
				await ProcessCommandService.answer(attemptId, { questionId, optionId });
			} catch (error) {
				cb({ error: "Failed to answer" });
				logSocket(`[${socket.id}] => Error`, { error });
			}
			this.namespace.to(attemptId.toString()).emit("ANSWERED", { questionId, optionId });
			logSocket(`[ROOM] - [${attemptId}] => ANSWERED | questionId: ${questionId} | optionId: ${optionId ?? 'undefined'}`);
		});
	}
}
