/**
 * @typedef {import('http').Server} HttpServer
 */

const { Server } = require('socket.io');
const testProcessSocket = require('../modules/test-process/test-process.controller.socket');
const validate = require('./middlewares/validaton.mdw');

/**
 * @param {HttpServer} httpServer 
 */
module.exports = (httpServer) => {
	const ioServer = new Server(httpServer, {
		cors: { origin: '*' }
	});

	testProcessSocket(ioServer.of('/test-process'));
}