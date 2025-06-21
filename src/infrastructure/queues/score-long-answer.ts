import { ScoreLongAnswerEvent } from "../../domain/_events/ScoreLongAnswer";
import { MessageBrokerService } from "../../services/MessageBrokerService";
import { EventDispatcher } from "../../shared/domain/EventDispatcher";

export class ScoreLongAnswerQueue {
	static readonly QUEUE_NAME = 'score-long-answer';

	static async score(answerId: string, answer: string, correctAnswer: string, points: number): Promise<void> {
		const broker = await MessageBrokerService.getInstance();
		broker.sendToQueue(this.QUEUE_NAME, JSON.stringify({
			answer,
			correctAnswer,
			points,
			timestamp: new Date().toISOString()
		}));

		broker.consume(this.QUEUE_NAME, async (msg) => {
			if (msg !== null) {
				const data = JSON.parse(msg.content.toString());
				const { score } = data;
				EventDispatcher.getInstance().dispatch(new ScoreLongAnswerEvent(answerId, score));
			}
		});
	}
}
