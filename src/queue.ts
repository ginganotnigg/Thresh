import { MessageBrokerService } from "./services/MessageBrokerService";

MessageBrokerService.getInstance().then(async (broker) => {
	try {
		// Example usage of the message broker
		const queueName = 'example_queue';
		const message = 'Hello, RabbitMQ!';

		// Send a message to the queue
		await broker.sendToQueue(queueName, message);
		console.log(`[x] Sent '${message}' to queue '${queueName}'`);

		await broker.consume("cac", (msg) => {
			if (msg !== null) {
				const content = msg.content.toString();
				console.log(`[x] Received '${content}' from queue '${queueName}'`);
			}
			process.exit(0);
		}, { noAck: true });

	} catch (error) {
		console.error('Error in message broker example:', error);
	}
}).catch((error) => {
	console.error('Failed to initialize message broker:', error);
});
