/**
 * @typedef {import('http').Server} HttpServer
 */

const http = require('http');
const { Server } = require('socket.io');
const testProcessController = require('../modules/test-process/test-process.controller');
const validate = require('./middlewares/validaton.mdw');

/**
 * @param {HttpServer} httpServer 
 */
module.exports = (httpServer) => {
	const ioServer = new Server(httpServer, {
		cors: { origin: '*' }
	});

	// Middlewares
	ioServer.use((socket, next) => {
		console.log('Socket middleware');
		next();
	});

	// For development
	let connectedUsers = new Map();

	ioServer.on('connection', (socketClient) => {

		// Middlewares for clients
		socketClient.use(validate.socket.validatePacketData);

		console.log(new Date().toISOString());
		console.log(`Client connected: ${socketClient.id}`);
		connectedUsers.set(socketClient.id, socketClient);
		console.log(connectedUsers);

		socketClient.on('disconnect', () => {
			console.log(new Date().toISOString());
			console.log(`Client disconnected: ${socketClient.id}`);
			connectedUsers.delete(socketClient.id);
			console.log(connectedUsers);
		});

		// Controllers
		testProcessController(ioServer.of('/test-process'));
	});

	const PORT = process.env.PORT || 3000;
}