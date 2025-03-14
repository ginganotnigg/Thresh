import { Server } from "socket.io";
import { env } from "./env";
import { instrument } from "@socket.io/admin-ui";
import { logSocket } from "../configs/logger/winston";

export function configSocket() {
	const io = new Server({
		cors: {
			origin: env.corsOrigin,
		}
	});

	io.use((socket, next) => {
		const token = socket.handshake.auth.token;
		if (!token) {
			return next(new Error("Authentication error"));
		}
		socket.data.userId = token;
		return next();
	});

	io.on('connection', (socket) => {
		logSocket(`[${socket.id}] => Client connected`);

		socket.on('disconnect', () => {
			logSocket(`[${socket.id}] => Client disconnected`);
		});
	});

	instrument(io, {
		auth: false,
		mode: "development",
	});
	console.log("Socket Admin UI at: https://admin.socket.io/#/");

	return io;
}