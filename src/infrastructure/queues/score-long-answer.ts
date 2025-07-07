import { env } from "../../configs/env";
import { ScoreLongAnswerEvent } from "../../domain/_events/ScoreLongAnswer";
import { MessageBrokerService } from "../../services/MessageBrokerService";
import { EventDispatcher } from "../../shared/domain/EventDispatcher";

export class ScoreLongAnswerQueue {
	private static readonly REQ_QUEUE = env.rabbitQueues.scoreLongAnswerReq || "score-long-answer-req";
	private static readonly RES_QUEUE = env.rabbitQueues.scoreLongAnswerRes || "score-long-answer-res";


	static async score(
		{
			attemptId,
			questionText,
			answerId,
			answer,
			correctAnswer,
			points,
			userId,
			language,
		}: {
			attemptId: string,
			questionText: string,
			answerId: string,
			answer: string,
			correctAnswer: string,
			points: number,
			userId: string,
			language: string,
		}
	): Promise<void> {
		const broker = await MessageBrokerService.getInstance();
		if (!broker) {
			console.error("MessageBrokerService is not initialized.");
			return;
		}

		try {
			const timestamp = new Date().toISOString();
			const message = JSON.stringify({
				questionText,
				answer,
				correctAnswer,
				points,
				language,

				// Extra information
				x_user_id: userId,
				timestamp,
				answerId,
			});

			// console.log(`Sending to queue ${this.REQ_QUEUE} with attemptId: ${attemptId}, answerId: ${answerId}: ${message}`);

			console.log(`[QUEUE_REQ] answerId: ${answerId}`);
			console.log(`Message: ${message}`);

			broker?.sendToQueue(this.REQ_QUEUE, message);

			broker?.consume(this.RES_QUEUE, async (msg) => {
				// console.log(`Received message from queue ${this.RES_QUEUE} for attemptId: ${attemptId}, answerId: ${answerId}: ${msg?.content.toString()}`);
				try {
					// NOTE: Do not take the answerId and attmeptId from the request above since it could be belong to another request
					if (msg !== null) {
						const data = JSON.parse(msg.content.toString());
						const {
							score,
							comment,
							answerId: responseAnswerId,
						} = data;

						console.log(`[QUEUE_RESP] answerId: ${responseAnswerId}`);
						console.log(`Message: ${msg?.content.toString()}`);

						try {
							EventDispatcher.getInstance().dispatch(new ScoreLongAnswerEvent(responseAnswerId, score || 0, comment));
						} catch (error) {
							console.error(`Error dispatching ScoreLongAnswerEvent for answerId: ${responseAnswerId}`, error);
						}
					}
				} catch (error) {
					console.error(`Error parsing message: `, error);
				}
			}, {
				noAck: true, // Automatically acknowledge the message
			});
		} catch (error) {
			console.error(`Error sending message to queue ${this.REQ_QUEUE} for attemptId: ${attemptId}, answerId: ${answerId}`, error);
		}
	}
}
