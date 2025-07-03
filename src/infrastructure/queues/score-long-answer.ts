import { ScoreLongAnswerEvent } from "../../domain/_events/ScoreLongAnswer";
import { MessageBrokerService } from "../../services/MessageBrokerService";
import { EventDispatcher } from "../../shared/domain/EventDispatcher";

export class ScoreLongAnswerQueue {
	static readonly QUEUE_NAME = 'score-long-answer';

	static async score(
		attemptId: string,
		questionText: string,
		answerId: string,
		answer: string,
		correctAnswer: string,
		points: number,
		userId: string
	): Promise<void> {
		const broker = await MessageBrokerService.getInstance();
		console.log(`Sending to queue ${this.QUEUE_NAME} with attemptId: ${attemptId}, answerId: ${answerId}`);

		broker.sendToQueue(this.QUEUE_NAME, JSON.stringify({
			questionText,
			answer,
			correctAnswer,
			points,
			"x-user-id": userId,
			timestamp: new Date().toISOString()
		}));

		broker.consume(this.QUEUE_NAME, async (msg) => {
			console.log(`Received message from queue ${this.QUEUE_NAME} for attemptId: ${attemptId}, answerId: ${answerId}: ${msg?.content.toString()}`);
			if (msg !== null) {
				const data = JSON.parse(msg.content.toString());
				const {
					score,
					comment,
				} = data;
				EventDispatcher.getInstance().dispatch(new ScoreLongAnswerEvent(attemptId, answerId, score));
			}
		});
	}
}
