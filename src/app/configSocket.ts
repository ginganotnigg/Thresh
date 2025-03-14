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