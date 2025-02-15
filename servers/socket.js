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

	ioServer.on('connection', (socketClient) => {

		// Middlewares for clients
		socketClient.use(validate.socket.validatePacketData);

		console.log(`Client connected: ${socketClient.id}`);
		socketClient.on('disconnect', () => {
			console.log(`Client disconnected: ${socketClient.id}`);
		});

		socketClient.on('ping', (data) => {
			console.log('Ping:', data);
			socketClient.emit('pong', 'pong');
		});

		// Controllers
		testProcessController(ioServer.of('/test-process'));
	});
}