// @ts-check

/**
 * @typedef {import('http').Server} HttpServer
 */

const { Server: IoServer } = require('socket.io');

/**
 * @param {HttpServer} httpServer 
 */
module.exports = (httpServer) => {
	const ioServer = new IoServer(httpServer, {
		cors: { origin: '*' }
	});

	console.log('SOCKET server initialized');
	return ioServer;
}