import * as amqp from 'amqplib';
import { env } from '../configs/env';

export class MessageBrokerService {
	private readonly channelModel: amqp.ChannelModel;
	private readonly channel: amqp.Channel;

	private constructor(channelModel: amqp.ChannelModel, channel: amqp.Channel) {
		this.channelModel = channelModel;
		this.channel = channel;
	}

	private static instance: MessageBrokerService | null = null;

	static async getInstance(): Promise<MessageBrokerService | null> {
		if (this.instance !== null) {
			return this.instance;
		}
		try {
			const url = env.rabbitmqHost;
			const channelModel = await amqp.connect(url);
			const channel = await channelModel.createChannel();
			console.log('MessageBrokerService instance created successfully');
			this.instance = new MessageBrokerService(channelModel, channel);
			return this.instance;
		} catch (error) {
			console.error('Failed to create MessageBrokerService:', error);
			this.instance = null;
			return null;
		}
	}

	public async sendToQueue(
		queueName: string,
		message: string
	): Promise<void> {
		await this.channel.assertQueue(queueName, { durable: true });
		this.channel.sendToQueue(queueName, Buffer.from(message));
	}

	public async consume(
		queueName: string,
		handler: (msg: amqp.ConsumeMessage | null) => void,
		options?: amqp.Options.Consume
	): Promise<void> {
		await this.channel.assertQueue(queueName, { durable: true });
		this.channel.consume(queueName, handler, options);
	}

	public static async close(): Promise<void> {
		if (!this.instance) {
			console.warn('MessageBrokerService is not initialized');
			return;
		}
		if (this.instance.channel) {
			await this.instance.channel.close();
		}
		if (this.instance.channelModel) {
			await this.instance.channelModel.close();
		}
		this.instance = null;
		console.log('MessageBrokerService closed');
	}
}