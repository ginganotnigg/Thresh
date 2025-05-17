// import amqp from 'amqplib';

// export class RabbitMQ {
// 	private connection: amqp.Connection | null = null;
// 	private channel: amqp.Channel | null = null;
// 	private url: string;

// 	constructor(url: string = 'amqp://skillsharp:Skillsharp@123@10.148.0.2:5672/') {
// 		this.url = url;
// 	}

// 	/**
// 	 * Connect to RabbitMQ server
// 	 */
// 	public async connect(): Promise<void> {
// 		try {
// 			this.connection = await amqp.connect(this.url);
// 			this.channel = await this.connection.createChannel();

// 			// Handle connection close events
// 			this.connection.on('close', () => {
// 				console.log('RabbitMQ connection closed');
// 				this.connection = null;
// 				this.channel = null;
// 			});

// 			console.log('Connected to RabbitMQ');
// 		} catch (error) {
// 			console.error('Error connecting to RabbitMQ:', error);
// 			throw error;
// 		}
// 	}

// 	/**
// 	 * Create a queue if it doesn't exist
// 	 */
// 	public async createQueue(queue: string, options?: amqp.Options.AssertQueue): Promise<amqp.Replies.AssertQueue> {
// 		if (!this.channel) {
// 			throw new Error('Channel not established. Call connect() first.');
// 		}
// 		return await this.channel.assertQueue(queue, options);
// 	}

// 	/**
// 	 * Send a message to a queue
// 	 */
// 	public async sendToQueue(queue: string, message: Buffer | string, options?: amqp.Options.Publish): Promise<boolean> {
// 		if (!this.channel) {
// 			throw new Error('Channel not established. Call connect() first.');
// 		}

// 		const content = typeof message === 'string' ? Buffer.from(message) : message;
// 		return this.channel.sendToQueue(queue, content, options);
// 	}

// 	/**
// 	 * Consume messages from a queue
// 	 */
// 	public async consume(
// 		queue: string,
// 		callback: (msg: amqp.ConsumeMessage | null) => void,
// 		options?: amqp.Options.Consume
// 	): Promise<amqp.Replies.Consume> {
// 		if (!this.channel) {
// 			throw new Error('Channel not established. Call connect() first.');
// 		}
// 		return this.channel.consume(queue, callback, options);
// 	}

// 	/**
// 	 * Acknowledge a message
// 	 */
// 	public ack(message: amqp.ConsumeMessage, allUpTo?: boolean): void {
// 		if (!this.channel) {
// 			throw new Error('Channel not established. Call connect() first.');
// 		}
// 		this.channel.ack(message, allUpTo);
// 	}

// 	/**
// 	 * Close the connection
// 	 */
// 	public async close(): Promise<void> {
// 		if (this.channel) {
// 			await this.channel.close();
// 		}
// 		if (this.connection) {
// 			await this.connection.close();
// 		}
// 		this.channel = null;
// 		this.connection = null;
// 	}
// }

// export default RabbitMQ;