import { Namespace, Socket } from "socket.io";

interface ListenEvents {
	REGISTERED: (data: { attemptId: number; }, cb: (ack: { isInprogress: boolean }) => void) => void;
	ANSWERED: (data: { attemptId: number; questionId: number; optionId?: number; }, cb: (error: { error?: string; }) => void) => void;
}

interface EmitEvents {
	ENDED: () => void;
	CLOCK_SYNCED: (data: { secondsLeft: number; }) => void;
	ANSWERED: (data: { questionId: number; optionId?: number; }) => void;
}

interface SocketData {
	candidateId: string;
}

export type CurrentTestNamespace = Namespace<ListenEvents, EmitEvents, {}, SocketData>;

export type CurrentTestSocket = Socket<ListenEvents, EmitEvents, {}, SocketData>;