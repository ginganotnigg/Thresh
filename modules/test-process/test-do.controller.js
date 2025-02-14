const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "*",  // In production, replace with your client's domain
		methods: ["GET", "POST"]
	}
});

// Track connected users
let connectedUsers = new Map();

io.on('connection', (socket) => {
	console.log(`Client connected with ID: ${socket.id}`);

	// Handle user registration
	socket.on('register', (userData) => {
		connectedUsers.set(socket.id, userData);
		io.emit('userList', Array.from(connectedUsers.values()));
	});

	// Handle private messages
	socket.on('privateMessage', ({ to, message }) => {
		const recipientSocket = Array.from(io.sockets.sockets).find(
			([id, _]) => connectedUsers.get(id)?.userId === to
		);
		if (recipientSocket) {
			io.to(recipientSocket[0]).emit('privateMessage', {
				from: socket.id,
				message
			});
		}
	});

	// Handle room operations
	socket.on('joinRoom', (room) => {
		socket.join(room);
		socket.to(room).emit('userJoined', {
			userId: socket.id,
			room
		});
	});

	socket.on('leaveRoom', (room) => {
		socket.leave(room);
		socket.to(room).emit('userLeft', {
			userId: socket.id,
			room
		});
	});

	// Handle broadcast messages
	socket.on('message', (msg) => {
		io.emit('message', {
			userId: socket.id,
			message: msg,
			timestamp: new Date()
		});
	});

	// Handle disconnection
	socket.on('disconnect', () => {
		console.log(`Client disconnected: ${socket.id}`);
		connectedUsers.delete(socket.id);
		io.emit('userList', Array.from(connectedUsers.values()));
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Socket.IO server running on port ${PORT}`);
});