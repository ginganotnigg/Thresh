module.exports = {
	socket: {
		validatePacketData(packet, next) {
			// Validate packet data
			next();
		}
	}
}