import { ScoreLongAnswerEvent } from "../../domain/_events/ScoreLongAnswer";
import { MessageBrokerService } from "../../services/MessageBrokerService";
import { EventDispatcher } from "../../shared/domain/EventDispatcher";
import { CredentialsMeta } from "../../shared/controller/schemas/meta";
import { CredentialsBase, ReverseRoleNames } from "../../shared/types/credentials";

export class ScoreLongAnswerQueue {
	static readonly QUEUE_NAME = 'score-long-answer';

	static async score(questionText: string, answerId: string, answer: string, correctAnswer: string, points: number, credentials: CredentialsBase): Promise<void> {
		const broker = await MessageBrokerService.getInstance();
		const roleId = ReverseRoleNames[credentials.role];

		broker.sendToQueue(this.QUEUE_NAME, JSON.stringify({
			questionText: "",
			answer,
			correctAnswer,
			points,
			"x-user-id": credentials.userId,
			"x-role-id": roleId,
			timestamp: new Date().toISOString()
		}));

		broker.consume(this.QUEUE_NAME, async (msg) => {
			if (msg !== null) {
				const data = JSON.parse(msg.content.toString());
				const {
					score,
					comment,
				} = data;
				EventDispatcher.getInstance().dispatch(new ScoreLongAnswerEvent(answerId, score));
			}
		});
	}
}
